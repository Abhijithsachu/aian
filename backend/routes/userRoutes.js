import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  adminDashboard,
  getUsers,
} from "../controllers/userController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", getUsers);

router.get("/profile", protect, getUserProfile);
router.get("/admin", protect, adminOnly, adminDashboard);

export default router;