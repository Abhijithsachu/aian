import express from "express";

import {
  createProduct,
  getAllProducts,
  getLatestProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/latest", getLatestProducts);
router.get("/:id", getSingleProduct);

router.post(
  "/create",
  protect,
  adminOnly,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;