import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { toast } from "react-toastify";
import "./Collections.css";

function Collections() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  const BASE_URL = "https://aianjewels-backend.onrender.com";

  const categories = [
    "All",
    "Ring",
    "Chain",
    "Bangle",
    "Earring",
    "Bracelet",
    "Necklace",
  ];

  // ---------------- IMAGE URL FIX ----------------
  const getImageUrl = (product) => {
    const imagePath = Array.isArray(product.images)
      ? product.images[0]
      : product.images || product.image;

    if (!imagePath) {
      return "https://via.placeholder.com/300";
    }

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    return `${BASE_URL}/${imagePath.replace(/^\/+/, "")}`;
  };

  // ---------------- CART RESPONSE FIX ----------------
  const getCartItemsFromResponse = (data) => {
    return data?.items || data?.cart?.items || data?.data?.items || [];
  };

  // ---------------- FETCH PRODUCTS ----------------
  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const res = await api.get("/products");

        const productData = Array.isArray(res.data)
          ? res.data
          : res.data?.products || res.data?.data || [];

        if (!cancelled) {
          setProducts(productData);
        }
      } catch (err) {
        console.log("PRODUCT FETCH ERROR:", err.response?.data || err.message);

        if (!cancelled) {
          toast.error("Failed to load products");
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------- FETCH CART ON PAGE LOAD ----------------
  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const res = await api.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cartItems = getCartItemsFromResponse(res.data);

        if (!cancelled) {
          setCart(cartItems);
        }
      } catch (err) {
        console.log("CART FETCH ERROR:", err.response?.data || err.message);

        if (!cancelled) {
          setCart([]);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------- REFRESH CART AFTER ADD ----------------
  const refreshCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCart([]);
        return;
      }

      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cartItems = getCartItemsFromResponse(res.data);
      setCart(cartItems);
    } catch (err) {
      console.log("REFRESH CART ERROR:", err.response?.data || err.message);
      setCart([]);
    }
  };

  // ---------------- ADD TO CART ----------------
 const addToCart = async (product) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/Collections");
      return false;
    }

    const res = await api.post(
      "/cart/add",
      {
        productId: product._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const cartItems = getCartItemsFromResponse(res.data);

    if (cartItems.length > 0) {
      setCart(cartItems);
    } else {
      await refreshCart();
    }

    if (res.data?.alreadyExists) {
      toast.info("Product already in cart");
    } else {
      toast.success("Added to cart 🛒");
    }

    return true;
  } catch (err) {
    console.log("ADD TO CART ERROR:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to add to cart");
    return false;
  }
};

  // ---------------- BUY NOW - WHATSAPP DIRECT ----------------
  const buyNow = (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/Collections");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const userName = user?.name || "Customer";
    const userPhone = user?.phone || "Not Provided";
    const userAddress = user?.address || "Not Provided";

    const productName = product.name || "Product";
    const productCategory = product.category || "Not Provided";
    const productPrice = Number(product.price || 0);
    const productQty = 1;
    const productTotal = productPrice * productQty;

    const message = `
🛒 *New Order - AiAn Jewels*

👤 *Customer Details*
Name: ${userName}
Phone: ${userPhone}
Address: ${userAddress}

📦 *Product Details*
Product: ${productName}
Category: ${productCategory}
Qty: ${productQty}
Price: ₹${productPrice.toLocaleString()}
Total: ₹${productTotal.toLocaleString()}

📍 Please confirm my order.
`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "919567659841";

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  // ---------------- QUICK VIEW ----------------
  const openQuickView = (product) => {
    setSelectedProduct(product);
  };

  const closeQuickView = () => {
    setSelectedProduct(null);
  };

  // ---------------- FILTER PRODUCTS ----------------
  const filteredProducts = products
    .filter((product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory === "All"
        ? true
        : product.category?.toLowerCase() === selectedCategory.toLowerCase()
    );

  return (
    <div className="collections-container">
      {/* HEADER */}
      <div className="collections-header">
        <button className="Collection-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <h2 className="collections-title">Our Collections</h2>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? "active" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <div className="collections-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="collections-card"
              onClick={() => openQuickView(product)}
            >
              <div className="image-box">
                <img
                  src={getImageUrl(product)}
                  alt={product.name}
                  className="collections-image"
                />
              </div>

              <div className="product-info">
                <span className="product-category">{product.category}</span>

                <h3 className="product-name">{product.name}</h3>

                <p className="collections-price">
                  ₹{Number(product.price || 0).toLocaleString()}
                </p>

                <button
                  className="add-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">
            No products found matching "{searchTerm}"
          </p>
        )}
      </div>

      {/* FLOATING CART */}
      <Link to="/Cart" className="floating-cart">
        <FaShoppingCart size={24} />
        {cart.length > 0 && <span>{cart.length}</span>}
      </Link>

      {/* MODAL */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeQuickView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeQuickView}>
              ✕
            </button>

            <div className="modal-image-box">
              <img
                src={getImageUrl(selectedProduct)}
                alt={selectedProduct.name}
                className="modal-image"
              />
            </div>

            <div className="modal-info">
              <h2>{selectedProduct.name}</h2>

              <p className="modal-category">{selectedProduct.category}</p>

              <p className="modal-description">
                {selectedProduct.description || "No description available."}
              </p>

              <h3>₹{Number(selectedProduct.price || 0).toLocaleString()}</h3>

              <button
                className="add-button"
                onClick={() => addToCart(selectedProduct)}
              >
                Add to Cart
              </button>

              <button
                className="buy-button"
                onClick={() => buyNow(selectedProduct)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collections;