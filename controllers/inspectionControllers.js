import pool from '../config/db.js';
import { generateInspectionPDF,generatePostShipmentPDF,generateimggallery} from '../utils/pdfGenerator.js';
import { uploadDocumentToSupabase } from '../utils/pdfupload.js';
import {cloudinary} from '../config/cloudinary.js';


import { uploadPdfToSupabase } from '../utils/pdfupload.js';
 // Assuming cloudinary config exported as default

export const createInspection = async (req, res) => {
  const {
    contract_id,
    product_name,
    expected_quantity,
    packed_quantity,
    declared_weight,
    measured_weight,
    packaging_type,
    is_item_damaged,
    compliance,
    transport_mode,
    carrier_name,
    ship_name,
    final_comments
  } = req.body;
  const productPhotoUrl = req.files?.product_photo?.[0]?.path || null;
  const goodsPhotoUrl = req.files?.goods_photo?.[0]?.path || null;
  const damagePhotoUrl = req.files?.damage_photo?.[0]?.path || null;
  const documentUrl = req.files?.document_file?.[0]?.path || null;

  try {
    console.log(contract_id)
    const result_1=await pool.query(`SELECT buyer_id,seller_id FROM contracts WHERE id=$1`,[contract_id]);
    const buyer_id = result_1.rows[0].buyer_id;
    const seller_id = result_1.rows[0].seller_id;
    console.log(result_1.rows[0])
    // 2️⃣ Prepare report object
    const report = {
      contract_id,
      buyer_id,
      seller_id,
      product_name,
      expected_quantity,
      packed_quantity,
      declared_weight,
      measured_weight,
      packaging_type,
      is_item_damaged: is_item_damaged === 'true',
      compliance: compliance?.split(',') || [],
      transport_mode,
      carrier_name,
      ship_name,
      final_comments,
      product_photo_url: productPhotoUrl,
      goods_photo_url: goodsPhotoUrl,
      damage_photo_url: damagePhotoUrl,
      document_url: documentUrl
    };

    
    // 3️⃣ Generate PDF from report data
    const pdfBuffer = await generateInspectionPDF(report);
    console.log("pdf request uploaded")

 

    // 4️⃣ Upload PDF to Cloudinary
    const pdfUrl = await uploadPdfToSupabase(pdfBuffer, `pre_shipment_${contract_id}.pdf`);
    console.log(pdfUrl);
    console.log("pdf uploaded to supabase")

 

    // 5️⃣ Update DB with PDF URL
    await pool.query(`INSERT INTO pre_shipment(contract_id, product_name,product_photo_url,goods_photo_url,damage_photo_url,document_url,pdf_url) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [contract_id, product_name, productPhotoUrl, goodsPhotoUrl, damagePhotoUrl, documentUrl, pdfUrl]);
    console.log("pdf_url stored")

    // ✅ Done
    res.status(201).json({
      message: 'Pre-shipment report saved',
      pdf_url: pdfUrl
    });

  } catch (err) {
    console.error('Error Happened:', err);
    res.status(500).json({ error: 'Something Went Wrong' });
  }
};

export const createPostShipmentReport = async (req, res) => {
  console.log("request received")
  try {
    const {
      contract_id,
      items_present,
      items_damaged,
      rating,
      notes
    } = req.body;

    // Handle photo uploads
    const arrivalPhotoUrl = req.files?.arrival_photo?.[0]?.path || null;
    const damagePhotoUrl = req.files?.damage_photo?.[0]?.path || null;


    // 2️⃣ Build report data for EJS
    const report = {
      contract_id,
      items_present: items_present === 'true',
      items_damaged: items_damaged === 'true',
      arrival_photo_url: arrivalPhotoUrl,
      damage_photo_url: damagePhotoUrl,
      rating,
      notes
    };
    console.log(report);



    // 3️⃣ Generate PDF
    const pdfBuffer = await generatePostShipmentPDF(report);



    const pdfUrl = await uploadPdfToSupabase(pdfBuffer, `post_shipment_${contract_id}.pdf`);

    // 5️⃣ Update record with PDF URL
    await pool.query(`INSERT INTO post_shipment(contract_id,arrival_photo_url, damage_photo_url,pdf_url) VALUES ($1, $2, $3, $4) `,
      [contract_id,arrivalPhotoUrl,damagePhotoUrl, pdfUrl]);
    console.log("pdf_url stored")
    console.log(pdfUrl);
    console.log("pdf uploaded to supabase")

    res.status(201).json({
      message: 'Post-shipment report saved and PDF uploaded ',
      pdf_url: pdfUrl
    });

  } catch (err) {
    console.error('Post-shipment controller error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
export const InspectionDash_pre=async(req,res)=>{
  const { contract_id } = req.body;
  console.log("pre-shipment pdf request recieved");
  console.log(contract_id);

  try {
    const result = await pool.query(
      'SELECT pdf_url FROM pre_shipment WHERE contract_id = $1',[contract_id]
    );
    console.log(result.rows[0].pdf_url )

    if (!result.rows.length || !result.rows[0].pdf_url) {
      return res.status(404).json({ error: 'PDF not found 😢' });
    }

    res.status(200).json({ pdf_url: result.rows[0].pdf_url });
    console.log(res)
  } catch (err) {
    console.error('💔 Error fetching PDF:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const InspectionDash_post=async(req,res)=>{
  const { contract_id } = req.body;
  console.log("post-shipment pdf request recieved");
  console.log(contract_id);

  try {
    const result = await pool.query(
      'SELECT pdf_url FROM post_shipment WHERE contract_id = $1',[contract_id]
    );
    console.log(result.rows[0].pdf_url )

    if (!result.rows.length || !result.rows[0].pdf_url) {
      return res.status(404).json({ error: 'PDF not found 😢' });
    }

    res.status(200).json({ pdf_url: result.rows[0].pdf_url });
    console.log(res)
  } catch (err) {
    console.error('💔 Error fetching PDF:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getReportDetails = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT order_id,order_date, expected_shipment, product_list,username
      FROM order_reports`
    );
    res.status(200).json({ result: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to load report details" });
  }
};

// 📤 POST: Submit report data
export const handleReportOrder = async (req, res) => {
  try {
    const { report_reason,description} = req.body;
    let imageUrl = null;
    let documentUrl = null;
    if (req.files['report-photo']) {
      const photoPath = req.files['report-photo'][0].path;
      const cloudRes = await cloudinary.uploader.upload(photoPath);
      imageUrl = cloudRes.secure_url;
    }

    // ⿢ Upload document to Supabase
    if (req.files['document']) {
      documentUrl = await uploadDocumentToSupabase(req.files['document'][0]);
    }

    // ⿣ Update the order report in DB
    const result = await pool.query(
      `UPDATE order_reports
       SET report_reason = $1,
           description = $2,
           image_url = $3,
           docu_url = $4`,
      [report_reason, description, imageUrl, documentUrl]
    );
    console.log(result.rows[0]);
    
    res.status(200).json({ message: "Report submitted successfully", data: result.rows[0] });
  } catch (err) {
    console.error("Error submitting report:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};