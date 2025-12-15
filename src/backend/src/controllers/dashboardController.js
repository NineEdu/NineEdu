import mongoose from "mongoose";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Transaction from "../models/Transaction.js";
import Announcement from "../models/Announcement.js";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";

// get course stats
// route: GET /api/dashboard/:courseId/stats
const getSingleCourseStats = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. total students
    const totalStudents = await Enrollment.countDocuments({ courseId });

    // 2. total revenue
    const revenueAgg = await Transaction.aggregate([
      {
        $match: {
          courseId: new mongoose.Types.ObjectId(courseId),
          status: "success",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // 3. average progress
    const progressAgg = await Enrollment.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: null, avgProgress: { $avg: "$progress" } } },
    ]);
    const avgCompletion = Math.round(progressAgg[0]?.avgProgress || 0);

    res.json({
      totalStudents,
      totalRevenue,
      avgCompletion,
      rating: 4.8, // mock rating
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get enrolled students
// route: GET /api/dashboard/:courseId/students
const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { keyword } = req.query;

    let filter = { courseId };

    const students = await Enrollment.find(filter)
      .populate("userId", "fullName email avatar")
      .sort({ updatedAt: -1 });

    // format response
    const formattedStudents = students.map((enroll) => ({
      enrollmentId: enroll._id,
      studentId: enroll.userId._id,
      name: enroll.userId.fullName,
      email: enroll.userId.email,
      avatar: enroll.userId.avatar,
      progress: enroll.progress,
      joinedAt: enroll.createdAt,
      status: enroll.progress === 100 ? "Completed" : "In Progress",
    }));

    // manual search filter
    let result = formattedStudents;
    if (keyword) {
      const lowerKey = keyword.toLowerCase();
      result = formattedStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerKey) ||
          s.email.toLowerCase().includes(lowerKey)
      );
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get course certificates
// route: GET /api/dashboard/:courseId/certificates
const getCertificates = async (req, res) => {
  try {
    const { courseId } = req.params;
    const certs = await Certificate.find({ courseId })
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get admin stats
// route: GET /api/dashboard/admin-stats
const getAdminStats = async (req, res) => {
  try {
    // 1. kpi counts
    const totalUsers = await User.countDocuments({ role: "student" });
    const totalCourses = await Course.countDocuments();
    const totalOrders = await Transaction.countDocuments({ status: "success" });

    // 2. total revenue
    const revenueAgg = await Transaction.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // 3. chart data (last 12 months)
    const monthlyRevenue = await Transaction.aggregate([
      {
        $match: {
          status: "success",
          createdAt: {
            $gte: new Date(
              new Date().setFullYear(new Date().getFullYear() - 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // format for frontend
    const chartData = monthlyRevenue.map((item) => ({
      name: `M${item._id.month}`,
      total: item.total,
    }));

    res.json({
      kpi: {
        totalUsers,
        totalCourses,
        totalOrders,
        totalRevenue,
      },
      chartData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getSingleCourseStats,
  getEnrolledStudents,
  getCertificates,
  getAdminStats,
};
