import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import "./Cart.css";
import api from "../api";
import { toast } from "react-toastify";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/200";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    return `https://aianjewels-backend.onrender.com/${imagePath.replace(/^\/+/, "")}`;
  };

  const getCartItemsFromResponse = (data) => {
    return data?.items || data?.cart?.items || data?.data?.items || [];
  };

 const formatCartItems = (items) => {
  const mergedItems = {};

  items
    .filter((item) => item.productId)
    .forEach((item) => {
      const product = item.productId;
      const productId = String(product._id);

      if (mergedItems[productId]) {
        // ✅ Same product already exists, quantity add cheyyum
        mergedItems[productId].quantity += Number(item.quantity || 1);
      } else {
        // ✅ First time product
        mergedItems[productId] = {
          id: productId,
          name: product.name,
          price: Number(product.price) || 0,
          image: getImageUrl(product.images?.[0] || product.image),
          quantity: Number(item.quantity || 1),
        };
      }
    });

  return Object.values(mergedItems);
};

  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login first");
          navigate("/");
          return;
        }

        const res = await api.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log("CART RESPONSE:", res.data);

        const items = getCartItemsFromResponse(res.data);
        const formatted = formatCartItems(items);

        if (!cancelled) {
          setCartItems(formatted);
        }
      } catch (err) {
        console.error("FETCH CART ERROR:", err);

        if (!cancelled) {
          toast.error(err.response?.data?.message || "Failed to load cart");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/Login");
        return;
      }

      await api.delete(`/cart/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems((prev) => prev.filter((item) => item.id !== id));

      toast.success("Item removed");
    } catch (err) {
      console.error("REMOVE CART ERROR:", err);
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const productList = cartItems
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}\nQty: ${item.quantity}\nPrice: ₹${
            item.price
          }\nTotal: ₹${item.price * item.quantity}`
      )
      .join("\n\n");

    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const user = JSON.parse(localStorage.getItem("user"));

    const userName = user?.name || "Customer";
    const userPhone = user?.phone || "Not Provided";
    const userAddress = user?.address || "Not Provided";

    const message = `
🛒 *New Order - AiAn Jewels*

👤 Name: ${userName}
📞 Phone: ${userPhone}
🏠 Address: ${userAddress}

📦 Order Details:
${productList}

💰 Total: ₹${totalAmount}

📍 Please confirm my order.
`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "919567659841";

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <p className="loading-text">Loading cart...</p>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <button className="Cart-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <h1 className="page-title">Your Shopping Bag</h1>

        {cartItems.length > 0 ? (
          <div className="cart-content">
            <div className="items-section">
              {cartItems.map((item) => (
                <div key={item.id} className="item-card">
                  <img src={item.image} alt={item.name} className="item-img" />

                  <div className="item-info">
                    <h3 className="item-title">{item.name}</h3>

                    <p className="item-sku">
                      SKU: JW-00{String(item.id).slice(-4)}
                    </p>

                    <p className="item-unit-price">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="qty-display">Qty: {item.quantity}</div>

                  <div className="item-total-price">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => removeItem(item.id)}
                    title="Remove item"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>

            <div className="summary-section">
              <div className="summary-box">
                <h3>Order Summary</h3>

                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-total">
                  <span>Total Due</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to WhatsApp Checkout
                </button>

                <div className="trust-badges">
                  <p>✓ Insured Shipping</p>
                  <p>🚚 Shipping via India Post</p>
                  <p>Delivery within 5–10 days</p>
                  <p>Some products may have extra shipping charges</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Your bag is currently empty.</p>

            <button
              className="shop-now-btn"
              onClick={() => navigate("/Collections")}
            >
              Browse Collections
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;