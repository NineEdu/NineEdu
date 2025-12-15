import Announcement from "../models/Announcement.js";

// get course announcements
// route: GET /api/announcements/:courseId
const getAnnouncements = async (req, res) => {
  try {
    const { courseId } = req.params;
    const list = await Announcement.find({ courseId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create announcement
// route: POST /api/announcements
const createAnnouncement = async (req, res) => {
  try {
    const { courseId, title, content } = req.body;

    const announcement = await Announcement.create({
      courseId,
      instructorId: req.user._id,
      title,
      content,
    });

    // optional: send notification or email

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAnnouncements, createAnnouncement };
