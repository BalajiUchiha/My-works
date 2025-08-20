// middlewares/auth.js
import pool from '../config/db.js';

// 🔒 Middleware: Check if user is logged in
export const requireLogin = (req, res, next) => {
  console.log('req.session recieved', req.session);
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }
  console.log("Login Success")
  next();
};

// 🔐 Middleware: Check if user has an active contract
export const requireContract = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    console.log("Contract Check req recieved userId",userId)
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not logged in' });
    }

    const result = await pool.query(
      'SELECT id FROM contracts WHERE buyer_id = $1 OR seller_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'No contract found' });
    }

    req.contract_id = result.rows[0].id;
    console.log("Contract Check req recieved result.rows[0].id",req.contract_id) // Save for future use
    next();
  } catch (err) {
    console.error('Contract check error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};