import Cart from "../Model/Cart.js";
import Product from "../Model/Product.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
      });
    }

    res.status(200).json({
      cart,
      items: cart.items,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cart fetch failed",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
      });
    }

    const alreadyExists = cart.items.some(
      (item) => item.productId.toString() === productId
    );

    if (alreadyExists) {
      const populatedCart = await Cart.findOne({
        userId: req.user._id,
      }).populate("items.productId");

      return res.status(200).json({
        message: "Product already in cart",
        alreadyExists: true,
        cart: populatedCart,
        items: populatedCart.items,
      });
    }

    cart.items.push({
      productId,
      quantity: 1,
    });

    await cart.save();

    const updatedCart = await Cart.findOne({
      userId: req.user._id,
    }).populate("items.productId");

    res.status(200).json({
      message: "Product added to cart",
      alreadyExists: false,
      cart: updatedCart,
      items: updatedCart.items,
    });
  } catch (error) {
    res.status(500).json({
      message: "Add to cart failed",
      error: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({
      userId: req.user._id,
    }).populate("items.productId");

    res.status(200).json({
      message: "Product removed from cart",
      cart: updatedCart,
      items: updatedCart.items,
    });
  } catch (error) {
    res.status(500).json({
      message: "Remove from cart failed",
      error: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(200).json({
        message: "Cart already empty",
        items: [],
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: "Cart cleared",
      cart,
      items: [],
    });
  } catch (error) {
    res.status(500).json({
      message: "Clear cart failed",
      error: error.message,
    });
  }
};