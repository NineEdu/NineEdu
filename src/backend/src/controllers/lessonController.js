import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Lesson from "../models/Lesson.js";

// get lessons by course
// route: GET /api/lessons/:courseId
const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user ? req.user._id : null;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isInstructor =
      userId && course.instructorId.toString() === userId.toString();
    const isAdmin = req.user && req.user.role === "admin";

    // check enrollment status & progress
    let isEnrolled = false;
    let completedLessonIds = [];

    if (userId) {
      const enrollment = await Enrollment.findOne({ userId, courseId });
      if (enrollment) {
        isEnrolled = true;
        // convert objectId array to strings
        completedLessonIds = enrollment.completedLessons.map((id) =>
          id.toString()
        );
      }
    }

    // case 1: instructor or admin
    if (isInstructor || isAdmin) {
      const lessons = await Lesson.find({ courseId }).sort({ order: 1 });
      return res.json(lessons);
    }

    // case 2: enrolled student
    if (isEnrolled) {
      // use lean() to modify object
      const lessons = await Lesson.find({ courseId, isPublished: true })
        .sort({ order: 1 })
        .lean();

      // inject isCompleted status
      const lessonsWithStatus = lessons.map((lesson) => ({
        ...lesson,
        isCompleted: completedLessonIds.includes(lesson._id.toString()),
      }));

      return res.json(lessonsWithStatus);
    }

    // case 3: guest
    const lessons = await Lesson.find({ courseId, isPublished: true })
      .select("title order duration isPreview")
      .sort({ order: 1 });

    const lessonsForGuest = lessons.map((lesson) => ({
      ...lesson.toObject(),
      isCompleted: false,
    }));

    res.json(lessonsForGuest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get lesson detail (video + resources)
// route: GET /api/lessons/detail/:id
const getLessonDetail = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const course = await Course.findById(lesson.courseId);

    if (
      req.user.role === "admin" ||
      req.user._id.toString() === course.instructorId.toString()
    ) {
      return res.json(lesson);
    }

    const isEnrolled = await Enrollment.findOne({
      userId: req.user._id,
      courseId: course._id,
    });

    if (!isEnrolled) {
      return res.status(403).json({
        message: "Not enrolled in this course.",
      });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create lesson
// route: POST /api/lessons
const createLesson = async (req, res) => {
  try {
    const { courseId, title, content, videoUrl, resources, duration } =
      req.body;

    // check course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // check permission
    if (
      course.instructorId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to add lesson" });
    }

    // calculate order
    const lastLesson = await Lesson.findOne({ courseId }).sort({ order: -1 });
    const newOrder = lastLesson && lastLesson.order ? lastLesson.order + 1 : 1;

    const lesson = new Lesson({
      courseId,
      title,
      content,
      videoUrl,
      resources,
      order: newOrder,
      duration,
    });

    await lesson.save();

    // update total lessons count
    course.totalLessons = await Lesson.countDocuments({ courseId: courseId });
    await course.save();

    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update lesson
// route: PUT /api/lessons/:id
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findById(lesson.courseId);
    if (
      course.instructorId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// reorder lessons (drag & drop)
// route: PUT /api/lessons/reorder
const updateLessonOrder = async (req, res) => {
  try {
    // lessonsList: [{ _id, order }]
    const { courseId, lessonsList } = req.body;

    if (!lessonsList || !Array.isArray(lessonsList)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // check course ownership
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      course.instructorId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // bulk update for performance
    const operations = lessonsList.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { order: item.order },
      },
    }));

    await Lesson.bulkWrite(operations);

    res.json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete lesson
// route: DELETE /api/lessons/:id
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findById(lesson.courseId);
    if (
      course.instructorId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Lesson.findByIdAndDelete(id);

    // update total lessons count
    const count = await Lesson.countDocuments({ courseId: course._id });
    await Course.findByIdAndUpdate(course._id, { totalLessons: count });

    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getLessonsByCourse,
  getLessonDetail,
  createLesson,
  updateLesson,
  deleteLesson,
  updateLessonOrder,
};
