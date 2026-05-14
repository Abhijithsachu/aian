import Product from "../Model/Product.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      shippingCharge,
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Name, description, price and category are required",
      });
    }

    const imagePath = req.file
      ? `uploads/products/${req.file.filename}`
      : "";

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      image: imagePath,
      images: imagePath ? [imagePath] : [],
      shippingCharge: Number(shippingCharge || 0),
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Product creation failed",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Products fetch failed",
      error: error.message,
    });
  }
};

export const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Latest products fetch failed",
      error: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Product fetch failed",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      shippingCharge,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.category = category || product.category;

    if (shippingCharge !== undefined) {
      product.shippingCharge = Number(shippingCharge || 0);
    }

    if (req.file) {
      const imagePath = `uploads/products/${req.file.filename}`;
      product.image = imagePath;
      product.images = [imagePath];
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Product update failed",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Product delete failed",
      error: error.message,
    });
  }
};