import Certificate from "../models/Certificate.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import crypto from "crypto";

// helper: generate random certificate code
const generateCertificateCode = () => {
  return "CERT-" + crypto.randomBytes(4).toString("hex").toUpperCase();
};

// issue new certificate
// route: POST /api/certificates
const issueCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    // 1. check enrollment progress
    const enrollment = await Enrollment.findOne({ userId, courseId });

    if (!enrollment) {
      return res
        .status(404)
        .json({ message: "You have not enrolled in this course." });
    }

    // check completion status
    if (enrollment.status !== "completed" && enrollment.progress < 100) {
      return res.status(400).json({
        message:
          "Course not completed. Please finish 100% to claim your certificate.",
      });
    }

    // 2. check existing certificate
    const existingCertificate = await Certificate.findOne({ userId, courseId });
    if (existingCertificate) {
      return res.status(200).json({
        message: "Certificate already exists for this course.",
        certificate: existingCertificate,
      });
    }

    // 3. create new certificate
    const newCertificate = new Certificate({
      userId,
      courseId,
      certificateCode: generateCertificateCode(),
      issuedAt: new Date(),
    });

    await newCertificate.save();

    // populate info for immediate display
    await newCertificate.populate("courseId", "title thumbnail");
    await newCertificate.populate("userId", "fullName");

    res.status(201).json(newCertificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get my certificates
// route: GET /api/certificates/my-certificates
const getMyCertificates = async (req, res) => {
  try {
    const userId = req.user._id;

    const certificates = await Certificate.find({ userId })
      .populate("courseId", "title thumbnail instructorId") // get course info
      .populate("userId", "fullName email") // get user info
      .sort({ issuedAt: -1 }); // sort newest first

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get certificate details (public)
// route: GET /api/certificates/:code
const getCertificateByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const certificate = await Certificate.findOne({ certificateCode: code })
      .populate("courseId", "title thumbnail description")
      .populate("userId", "fullName avatar");

    if (!certificate) {
      return res
        .status(404)
        .json({ message: "Certificate not found or invalid code." });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { issueCertificate, getMyCertificates, getCertificateByCode };
