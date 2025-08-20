// routes/reportRoutes.js
import express from "express";
import { submitOrderReport } from "../controllers/testupload.js";
import { reportUpload } from "../utils/upload.js";

const router = express.Router();

router.post("/report", reportUpload, submitOrderReport);

export default router;