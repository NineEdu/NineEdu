import express from "express";
import {
  issueCertificate,
  getMyCertificates,
  getCertificateByCode,
} from "../controllers/certificateController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect,
  /* #swagger.tags = ['Certificates']
     #swagger.description = 'Issue a certificate'
     #swagger.security = [{ "bearerAuth": [] }] */
  issueCertificate
);

router.get("/my-certificates", protect,
  /* #swagger.tags = ['Certificates']
     #swagger.description = 'Get my certificates'
     #swagger.security = [{ "bearerAuth": [] }] */
  getMyCertificates
);

router.get("/:code",
  /* #swagger.tags = ['Certificates']
     #swagger.description = 'Get certificate by code' */
  getCertificateByCode
);

export default router;
