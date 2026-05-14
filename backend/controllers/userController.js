import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Model/User.js";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ===============================
// REGISTER USER
// POST /api/users/register
// ===============================
export const registerUser = async (req, res) => {
  try {
    const { name, address, email, phone, password, confirmPassword } = req.body;

    if (!name || !address || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // If frontend sends confirmPassword, check it
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const phoneExists = await User.findOne({ phone });

    if (phoneExists) {
      return res.status(400).json({
        message: "User already exists with this phone number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      address,
      email,
      phone,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        address: user.address,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error while registering user",
      error: error.message,
    });
  }
};

// ===============================
// LOGIN USER / ADMIN
// POST /api/users/login
// ===============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: user.isAdmin ? "Admin login successful" : "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        address: user.address,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error while login",
      error: error.message,
    });
  }
};

// ===============================
// GET USER PROFILE
// GET /api/users/profile
// ===============================
export const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching profile",
      error: error.message,
    });
  }
};

// ===============================
// ADMIN TEST ROUTE
// GET /api/users/admin
// ===============================
export const adminDashboard = async (req, res) => {
  try {
    res.status(200).json({
      message: "Welcome Admin",
      admin: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while loading admin dashboard",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL NORMAL USERS
// GET /api/users
// ===============================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};
