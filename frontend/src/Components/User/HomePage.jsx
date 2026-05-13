import React, { useState, useEffect } from "react";
import "./HomePage.css";
import logo from "../../assets/aian_logo.jpg";
import {
  FaWhatsapp,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserCircle,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

function HomePage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const BASE_URL = "https://aianjewels-backend.onrender.com";

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

  // ---------------- NAVIGATE AND CLOSE MENU ----------------
  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  // ---------------- REFRESH CART ----------------
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
      navigate("/");
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
      navigate("/");
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

  // ---------------- MODAL ----------------
  const openQuickView = (product) => {
    setSelectedProduct(product);
  };

  const closeQuickView = () => {
    setSelectedProduct(null);
  };

  // ---------------- FETCH CART ----------------
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await api.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cartItems = getCartItemsFromResponse(res.data);
        setCart(cartItems);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
  }, []);

  // ---------------- FETCH PRODUCTS ----------------
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await api.get("/products/latest");

        const productData = Array.isArray(res.data)
          ? res.data
          : res.data?.products || res.data?.data || [];

        setProducts(productData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  // ---------------- SCROLL ANIMATION ----------------
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home">
      {/* NAVBAR */}
      <nav className="navbar-wrapper reveal">
        <div className="navbar">
          <div className="logo" onClick={() => goTo("/")}>
            <img src={logo} alt="Aian Jewels Logo" />
            <span>Aian Jewels</span>
          </div>

          <div className="nav-links">
            <span onClick={() => goTo("/HomePage")}>Home</span>
            <span onClick={() => goTo("/Collections")}>Collections</span>
            <span onClick={() => goTo("/Contact")}>Contact</span>
          </div>

          <div className="nav-actions">
            <div className="nav-cart" onClick={() => goTo("/Cart")}>
              🛒 {cart.length}
            </div>

            {isLoggedIn ? (
              <button
                className="profile-btn"
                onClick={() => goTo("/Profile")}
                title="Profile"
                aria-label="Profile"
              >
                <FaUserCircle />
              </button>
            ) : (
              <button className="login-btn" onClick={() => goTo("/Login")}>
                Login
              </button>
            )}

            <button
              className={`hamburger ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
            <span onClick={() => goTo("/HomePage")}>Home</span>
            <span onClick={() => goTo("/Collections")}>Collections</span>
            <span onClick={() => goTo("/Contact")}>Contact</span>
            <span onClick={() => goTo("/Cart")}>Cart ({cart.length})</span>

            {isLoggedIn ? (
              <span onClick={() => goTo("/Profile")}>Profile</span>
            ) : (
              <span onClick={() => goTo("/Login")}>Login</span>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero reveal">
        <h1>Luxury Jewelry Collection</h1>
        <p>Elegance meets perfection</p>
        <button onClick={() => goTo("/Collections")}>Shop Now</button>
      </section>

      {/* CATEGORY SECTION */}
      <section className="categories reveal">
        {["Ring", "Chain", "Bangle", "Earring", "Bracelet", "Necklace"].map(
          (item, index) => (
            <div
              key={index}
              className="category-card"
              onClick={() => goTo("/Collections")}
            >
              {item}
            </div>
          )
        )}
      </section>

      {/* PRODUCTS */}
      <section className="products reveal">
        <h2>New Arrivals</h2>

        {loading && <p>Loading products...</p>}
        {error && <p className="error-text">Failed to load products</p>}

        {!loading && !error && (
          <div className="home-grid">
            {products.length === 0 ? (
              <p>No products found</p>
            ) : (
              products.map((item) => (
                <div
                  className="home-card"
                  key={item._id}
                  onClick={() => openQuickView(item)}
                >
                  <div className="img-box">
                    <img src={getImageUrl(item)} alt={item.name} />
                  </div>

                  <div className="home-content">
                    <h4>{item.name}</h4>
                    <p className="desc">{item.category}</p>
                    <p className="price">
                      ₹{Number(item.price || 0).toLocaleString()}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials reveal">
        <div className="testimonial-header">
          <p className="testimonial-label">Customer reviews</p>
          <h2>
            Real people. <em>Real results.</em>
          </h2>
          <p className="testimonial-subtitle">
            Trusted by thousands of happy jewelry lovers worldwide
          </p>
        </div>

        <div className="review-stats">
          <div className="review-stat-item">
            <span>4.9</span>
            <p>Average rating</p>
          </div>

          <div className="stat-divider"></div>

          <div className="review-stat-item">
            <span>2K+</span>
            <p>Verified reviews</p>
          </div>

          <div className="stat-divider"></div>

          <div className="review-stat-item">
            <span>98%</span>
            <p>Would recommend</p>
          </div>
        </div>

        <div className="testimonial-grid">
          <div className="testimonial-card featured-review">
            <span className="featured-badge">Top review</span>

            <div className="stars">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>

            <span className="review-tag">Necklace</span>

            <p className="review-text">
              Absolutely beautiful jewelry. The finishing, shine, and packaging felt
              premium. I wore it for a family function and got so many compliments.
            </p>

            <div className="reviewer">
              <div className="avatar av-teal">AS</div>

              <div>
                <h4>Anjali S.</h4>
                <p>Kerala · 3 days ago</p>
              </div>

              <div className="verified">
                <span>✓</span> Verified
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>

            <span className="review-tag">Ring</span>

            <p className="review-text">
              Loved the design. It looks elegant and premium. The product looked even
              better than the photos.
            </p>

            <div className="reviewer">
              <div className="avatar av-blue">RK</div>

              <div>
                <h4>Rahul K.</h4>
                <p>Bangalore · 1 week ago</p>
              </div>

              <div className="verified">
                <span>✓</span> Verified
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span className="empty-star">★</span>
            </div>

            <span className="review-tag">Earring</span>

            <p className="review-text">
              Great customer service and beautiful collection. Delivery was quick and
              the earrings were packed safely.
            </p>

            <div className="reviewer">
              <div className="avatar av-coral">PM</div>

              <div>
                <h4>Priya M.</h4>
                <p>Chennai · 2 weeks ago</p>
              </div>

              <div className="verified">
                <span>✓</span> Verified
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>

            <span className="review-tag">Bracelet</span>

            <p className="review-text">
              Simple, classy, and lightweight. Perfect for daily wear. The quality is
              really good for the price.
            </p>

            <div className="reviewer">
              <div className="avatar av-purple">DN</div>

              <div>
                <h4>Divya N.</h4>
                <p>Kochi · 3 weeks ago</p>
              </div>

              <div className="verified">
                <span>✓</span> Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer reveal">
        <div className="footer-container">
          <div className="footer-col">
            <h3>AiAn Jewels</h3>
            <p>Premium handcrafted jewelry with elegance and perfection.</p>

            <div className="social-icons">
              <a
                href="https://wa.me/9567659841"
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://instagram.com/aian_jewels"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Collections</h4>
            <ul>
              <li>Ring</li>
              <li>Chain</li>
              <li>Bangle</li>
              <li>Earrings</li>
              <li>Bracelet</li>
              <li>Necklace</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Help & Policies</h4>
            <ul>
              <li onClick={() => goTo("/return-exchange")}>Return & Exchange</li>
              <li onClick={() => goTo("/ShippingPolicy")}>Shipping Policy</li>
              <li onClick={() => goTo("/PrivacyPolicy")}>Privacy Policy</li>
              <li onClick={() => goTo("/Termsofservice")}>Terms of Service</li>
              <li onClick={() => goTo("/CareInstructions")}>Care Instructions</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get In Touch</h4>

            <p className="contact-item">
              <FaMapMarkerAlt /> Malappuram, Kerala, India
            </p>

            <p className="contact-item">
              <MdEmail /> hello@aianjewels.com
            </p>

            <p className="contact-item">
              <FaPhoneAlt /> +91 9567659841
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 AiAn Jewels. All rights reserved.
        </div>
      </footer>

      {/* PRODUCT QUICK VIEW MODAL */}
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

              <h3>
                ₹{Number(selectedProduct.price || 0).toLocaleString()}
              </h3>

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

export default HomePage;