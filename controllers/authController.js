import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const signupUser = async (req, res) => {
  const { username, password,role } = req.body;
  

  try {

    const existingUser = await pool.query(
      'SELECT password FROM users WHERE username = $1',
      [username]
    );
    console.log(existingUser)

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new user into DB
    await pool.query(
      'INSERT INTO users (username,password,role) VALUES ($1, $2,$3)',
      [username, hashedPassword,role]
    );

    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(username,password)

  try {
    // 1️⃣ Find user in DB
    const result = await pool.query(
      'SELECT id,password,username,role FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pass = result.rows[0].password;
   
    // 2️⃣ Compare entered password with hashed password
    const validPassword = await bcrypt.compare(password, pass);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    req.session.user= {
    id: result.rows[0].id
  };
  console.log(req.session.user)
  
    // 3️⃣ Respond with success and user info
    res.status(200).json({ message: 'Login successful', user: { username: result.rows[0].username, role: result.rows[0].role } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
