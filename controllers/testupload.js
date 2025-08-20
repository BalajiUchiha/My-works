import { uploadDocumentToSupabase } from "../utils/pdfupload.js";
import { cloudinaryUpload } from "../config/cloudinary.js"; // Assume you already have this
import pool from "../config/db.js"; // PostgreSQL DB

export const submitOrderReport = async (req, res) => {
  try {
    const { reason, description} = req.body;
    console.log("Request to test recieved")
    // 1. Extract files
    const documentFile = req.files["document"]?.[0];
    const imageFile = req.files["report-photo"]?.[0];

    if (!documentFile || !imageFile) {
      return res.status(400).json({ error: "Both image and document are required" });
    }

    // 2. Upload image to Cloudinary
    const imageUrl = await cloudinaryUpload(imageFile);
    console.log(imageUrl)
    // 3. Upload document to Supabase
    const documentUrl = await uploadDocumentToSupabase(documentFile);
    console.log(documentUrl)
    // 4. Insert into DB
    const insertQuery = `
      INSERT INTO order_reports (report_reason, description, image_url, doc_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [reason, description, imageUrl, documentUrl];

    const result = await pool.query(insertQuery, values);
    console.log("Db upload completed")

    res.status(201).json({ success: true, report: result.rows[0] });
  } catch (err) {
    console.error("Submit Report Error:", err.message);
    res.status(500).json({ error: "Failed to submit report" });
  }
};