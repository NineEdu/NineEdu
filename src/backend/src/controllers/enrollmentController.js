import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// join course (free/paid)
// route: POST /api/enroll/join
const joinCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    // check course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // check existing enrollment
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "You already own this course" });
    }

    // handle enrollment

    // case 1: free course
    if (course.price === 0) {
      // create enrollment
      const enrollment = new Enrollment({
        userId,
        courseId,
        status: "in-progress",
        progress: 0,
      });
      await enrollment.save();

      // update user
      await User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledCourses: courseId },
      });

      return res.status(201).json({
        type: "FREE",
        message: "Free course enrollment successful",
        enrollment,
      });
    }

    // case 2: paid course
    else {
      return res.status(200).json({
        type: "PAID",
        message: "Paid course, please proceed to payment",
        coursePrice: course.price,
        // frontend handles payment flow
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// check enrollment status
// route: GET /api/enroll/check/:courseId
const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // find enrollment
    const enrollment = await Enrollment.findOne({ userId, courseId });

    if (enrollment) {
      return res.json({
        isEnrolled: true,
        status: enrollment.status,
        progress: enrollment.progress,
        enrollmentId: enrollment._id,
      });
    } else {
      return res.json({
        isEnrolled: false,
        status: null,
        progress: 0,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get my courses
// route: GET /api/enroll/my-courses
const getMyCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    // populate course details
    const enrollments = await Enrollment.find({ userId })
      .populate("courseId", "title thumbnail instructorId")
      .sort({ updatedAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// complete lesson & update progress
// route: POST /api/enroll/complete-lesson
const completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user._id;

    // find enrollment
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // add lesson if not completed
    const isCompleted = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId
    );

    if (!isCompleted) {
      enrollment.completedLessons.push(lessonId);
    }

    // calculate progress
    const course = await Course.findById(courseId);
    const totalLessons = course.totalLessons || 1; // avoid division by zero

    const progress = Math.round(
      (enrollment.completedLessons.length / totalLessons) * 100
    );

    enrollment.progress = progress > 100 ? 100 : progress;

    // update status if completed
    if (enrollment.progress === 100) {
      enrollment.status = "completed";
      // optional: certificate logic here
    }

    await enrollment.save();
    res.json({ message: "Progress updated", progress: enrollment.progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { joinCourse, getMyCourses, completeLesson, checkEnrollment };
