import express from 'express';
import authRoutes from './routes/authRoutes.js';
import inspectionRoutes from './routes/inspectionRoutes.js';
import faqRoutes from './routes/helpRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import pgSession from 'connect-pg-simple';
import testsession from './routes/reportRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))
// 🔓 Middleware to parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name:'connect.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false,
    httpOnly: true,
    sameSite:'lax',
    secure: false
  } // secure: true in production with HTTPS
}));
app.use(cookieParser());
// 🔗 Use our auth routes

app.use('/api/auth', authRoutes);
app.use('/api/inspection',inspectionRoutes)
app.use('/api/help',faqRoutes)
app.use('/api/test',testsession)
app.listen(5000, () => {
  console.log('⚡ Server running at http://localhost:5000');
});