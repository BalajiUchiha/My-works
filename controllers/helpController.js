// controllers/faqController.js
import pool from '../config/db.js';

export const getFaqs = async (req,res) => {
  try {
    const result = await pool.query('SELECT question,answer FROM faqs ORDER BY id');
    console.log(result.rows)
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching FAQs', err);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
};
