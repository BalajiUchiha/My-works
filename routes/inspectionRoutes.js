// routes/inspectionRoutes.js
import express from 'express';
import { createInspection,createPostShipmentReport, InspectionDash_post,InspectionDash_pre} from '../controllers/inspectionControllers.js';
import { preUpload,postUpload } from '../utils/upload.js';
import { getReportDetails, handleReportOrder } from "../controllers/inspectionControllers.js";
import { reportUpload } from "../utils/upload.js";


import { requireContract,requireLogin} from '../middlewares/isAuthenticated.js';

const router = express.Router();

// routes/inspectionRoutes.js
router.get('/check/contract',(res,req,next)=>{console.log("request to check contract is recieved");next();},requireContract)
router.post(
  '/pre-shipment-inspection', requireLogin,
  (req, res, next) => {
    console.log('📥 Incoming request received to /pre-shipment-inspection');
    next();
  },
  preUpload.fields([
    { name: 'product_photo', maxCount: 1 },
    { name: 'goods_photo', maxCount: 1 },
    { name: 'damage_photo', maxCount: 1 },
    { name: 'document_file', maxCount: 1 }
  ]),
  createInspection
);

router.post('/post-shipment-inspection',
(req,res,next)=>{console.log("pre-shipment request recieved");
  next();},
  postUpload.fields([{name:'arrival_photo',maxCount:1},{ name: 'damage_photo', maxCount: 1 }]),
requireLogin,requireContract,createPostShipmentReport);

// Serve pre-shipment PDF URL for viewing/downloading
router.post('/Inspectiondash-pre',InspectionDash_pre);
router.post('/Inspectiondash-post',InspectionDash_post);
router.get('/check-contract', requireLogin, requireContract, (req, res) => { res.status(200).json({
    success: true,
    contract_id: req.contract_id
  });
});
router.get("/ReportDetails",getReportDetails);
// router.post(
//   "/ReportData",
//   reportUpload.fields([
//     { name: "report-photo", maxCount: 1 },
//     { name: "document", maxCount: 1 },
//   ]),
//   handleReportOrder
// );


export default router;
