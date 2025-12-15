import express from "express";
import {
  issueCertificate,
  getMyCertificates,
  getCertificateByCode,
} from "../controllers/certificateController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, issueCertificate);
router.get("/my-certificates", protect, getMyCertificates);

router.get("/:code", getCertificateByCode);

export default router;
