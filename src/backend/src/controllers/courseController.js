import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";

// get courses (public)
// route: GET /api/courses
const getCourses = async (req, res) => {
  try {
    const {
      keyword,
      category,
      instructorId,
      level,
      tags,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = { isPublished: true };

    // keyword search
    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }

    // exact filters
    if (category && category !== "all") {
      filter.category = category;
    }
    if (instructorId) {
      filter.instructorId = instructorId;
    }
    if (level) {
      filter.level = level;
    }

    // price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // tags filter
    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagsArray };
    }

    // sort options
    let sortOption = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case "oldest":
          sortOption = { createdAt: 1 };
          break;
        case "price_asc":
          sortOption = { price: 1 };
          break;
        case "price_desc":
          sortOption = { price: -1 };
          break;
        case "name_asc":
          sortOption = { title: 1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    // pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // query db
    const totalCourses = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
      .populate("instructorId", "fullName avatar")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.json({
      data: courses,
      pagination: {
        totalCourses,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCourses / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get course details & lessons (public)
// route: GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructorId",
      "fullName avatar"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // select only basic lesson info
    const lessons = await Lesson.find({ courseId: course._id.toString() })
      .select("title order duration")
      .sort({ order: 1 });

    res.json({ ...course.toObject(), lessons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create course
// route: POST /api/courses
const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, tags, thumbnail } = req.body;

    const course = new Course({
      title,
      description,
      category,
      price,
      tags,
      thumbnail,
      instructorId: req.user._id,
      isPublished: true,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update course
// route: PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // check permissions
    if (
      course.instructorId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to update" });
    }

    // update fields
    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.thumbnail = req.body.thumbnail || course.thumbnail;
    course.price = req.body.price !== undefined ? req.body.price : course.price;
    course.category = req.body.category || course.category;
    course.tags = req.body.tags || course.tags;
    course.isPublished =
      req.body.isPublished !== undefined
        ? req.body.isPublished
        : course.isPublished;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete course
// route: DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      course.instructorId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    // delete related data
    await Lesson.deleteMany({ courseId: course._id });
    await Quiz.deleteMany({ courseId: course._id });
    await Course.deleteOne({ _id: course._id });

    res.json({ message: "Course and related data deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// manage courses (admin/instructor)
// route: GET /api/courses/manage
const getManageCourses = async (req, res) => {
  try {
    const {
      keyword,
      category,
      isPublished,
      page = 1,
      limit = 10,
      sort,
    } = req.query;
    const user = req.user;

    let filter = {};

    // role-based filter
    if (user.role === "admin") {
      if (req.query.instructorId) filter.instructorId = req.query.instructorId;
    } else if (user.role === "instructor") {
      filter.instructorId = user._id;
    } else {
      return res.status(403).json({ message: "Not authorized" });
    }

    // filters
    if (isPublished !== undefined) {
      filter.isPublished = isPublished === "true";
    }
    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }
    if (category && category !== "all") {
      filter.category = category;
    }

    // pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // sort
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };

    // query
    const totalCourses = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .populate("instructorId", "fullName avatar email")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.json({
      data: courses,
      pagination: {
        totalCourses,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCourses / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// course stats
// route: GET /api/courses/stats
const getCourseStats = async (req, res) => {
  try {
    const user = req.user;
    let matchStage = {};

    if (user.role !== "admin") {
      matchStage = { instructorId: user._id };
    }

    const stats = await Course.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          publishedCourses: {
            $sum: { $cond: [{ $eq: ["$isPublished", true] }, 1, 0] },
          },
          draftCourses: {
            $sum: { $cond: [{ $eq: ["$isPublished", false] }, 1, 0] },
          },
          totalValue: { $sum: "$price" },
        },
      },
    ]);

    res.json(
      stats[0] || {
        totalCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        totalValue: 0,
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getManageCourses,
  getCourseStats,
};
