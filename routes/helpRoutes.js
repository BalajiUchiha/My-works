// routes/faqRoutes.js
import express from 'express';
import { getFaqs } from '../controllers/helpController.js';
import { requireLogin } from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.get('/faq',requireLogin,getFaqs);

export default router;