import React, { useState, useEffect, useCallback } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    shippingCharge: "",
    image: null,
  });

  const navigate = useNavigate();

  const BASE_URL = "http://localhost:8000";

  const showToast = useCallback((message, type = "success") => {
    setToast({
      message,
      type,
      visible: true,
    });

    setTimeout(() => {
      setToast({
        message: "",
        type: "",
        visible: false,
      });
    }, 3000);
  }, []);

  const getArrayFromResponse = (data, keyName) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.[keyName])) return data[keyName];
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  // ---------------- PRODUCTS ----------------
  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/products");
      setProducts(getArrayFromResponse(res.data, "products"));
    } catch (err) {
      console.log("FETCH PRODUCTS ERROR:", err.response?.data || err.message);
      showToast("Failed to fetch products", "error");
    }
  }, [showToast]);

 

  // ---------------- LOAD DASHBOARD DATA ----------------
  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          api.get("/users"),
          api.get("/products"),
        ]);

        if (!isMounted) return;

        setUsers(getArrayFromResponse(usersRes.data, "users"));
        setProducts(getArrayFromResponse(productsRes.data, "products"));
      } catch (err) {
        console.log("LOAD DASHBOARD ERROR:", err.response?.data || err.message);

        if (isMounted) {
          showToast("Failed to load dashboard data", "error");
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    navigate("/Login");
  };

  // ---------------- FORM ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    setForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // ---------------- IMAGE FIX ----------------
  const getProductImage = (product) => {
    const imagePath = Array.isArray(product.images)
      ? product.images[0]
      : product.images || product.image;

    if (!imagePath) {
      return "https://via.placeholder.com/300x250?text=No+Image";
    }

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    return `${BASE_URL}/${imagePath.replace(/^\/+/, "")}`;
  };

  // ---------------- ADD ----------------
  const openAddModal = () => {
    setEditingProduct(null);

    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      shippingCharge: "",
      image: null,
    });

    setShowModal(true);
  };

  // ---------------- EDIT ----------------
  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      shippingCharge:
        product.shippingCharge !== undefined ? product.shippingCharge : "",
      image: null,
    });

    setShowModal(true);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      await fetchProducts();

      showToast("Product deleted successfully", "success");
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
      showToast("Delete failed", "error");
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append("shippingCharge", form.shippingCharge || 0);

      if (form.image) {
        data.append("image", form.image);
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        showToast("Product updated successfully", "success");
      } else {
        await api.post("/products/create", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        showToast("Product added successfully", "success");
      }

      setShowModal(false);
      setEditingProduct(null);

      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        shippingCharge: "",
        image: null,
      });

      await fetchProducts();
    } catch (err) {
      console.log("SUBMIT ERROR:", err.response?.data || err.message);
      showToast(err.response?.data?.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <h2 className="admin-logo">AiAn Jewels</h2>

          <ul className="sidebar-menu">
            <li
              className={activeTab === "products" ? "active" : ""}
              onClick={() => setActiveTab("products")}
            >
              Products
            </li>

            <li
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              Users
            </li>
          </ul>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="dashboard-content">
        <div className="dashboard-top">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your products and users</p>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-wrapper">
          <div className="stat-card">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>

          <div className="stat-card">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <section className="content-section">
            <div className="section-header">
              <h2>Products</h2>

              <button onClick={openAddModal} className="add-btn">
                + Add Product
              </button>
            </div>

            {products.length === 0 ? (
              <p className="empty-text">No products found</p>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="product-img"
                    />

                    <div className="product-info">
                      <h3>{product.name}</h3>

                      <p className="product-category">{product.category}</p>

                      <p className="product-desc">{product.description}</p>

                      <div className="price-row">
                        <span>
                          ₹{Number(product.price || 0).toLocaleString()}
                        </span>
                      </div>

                      <p className="shipping-text">
                        Shipping:{" "}
                        {Number(product.shippingCharge || 0) > 0
                          ? `₹${Number(
                              product.shippingCharge
                            ).toLocaleString()}`
                          : "Free Shipping"}
                      </p>

                      <div className="card-actions">
                        <button
                          className="edit-btn"
                          onClick={() => openEditModal(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <section className="content-section">
            <div className="section-header">
              <h2>Users</h2>
            </div>

            {users.length === 0 ? (
              <p className="empty-text">No users found</p>
            ) : (
              <div className="users-grid">
                {users.map((user) => (
                  <div key={user._id} className="user-card">
                    <div className="user-avatar">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div>
                      <h3>{user.name}</h3>
                      <p>{user.email}</p>
                      <p>{user.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                min="0"
                required
              />

              <input
                name="shippingCharge"
                type="number"
                placeholder="Shipping Charge, 0 for free shipping"
                value={form.shippingCharge}
                onChange={handleChange}
                min="0"
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Ring">Ring</option>
                <option value="Chain">Chain</option>
                <option value="Bangle">Bangle</option>
                <option value="Bracelet">Bracelet</option>
                <option value="Earring">Earring</option>
                <option value="Necklace">Necklace</option>
              </select>

              <input type="file" accept="image/*" onChange={handleImage} />

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.visible && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}

export default AdminDashboard;