import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api.js";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setMessage({ type: "", text: "" });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian phone number";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage({ type: "", text: "" });

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    try {
      setLoading(true);

      await api.post("/users/register", {
        name: formData.name,
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      showMessage("success", "Registration successful. Redirecting...");

      setTimeout(() => {
        navigate("/Login");
      }, 1500);
    } catch (error) {
      console.error(error.response?.data || error.message);

      showMessage(
        "error",
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="glass-card">
        <h2 className="title">Create Account</h2>

        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister} noValidate>
          <div className="input-box">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
              required
            />
            <label>Full Name</label>
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="input-box">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? "input-error" : ""}
              required
            />
            <label>Address</label>
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div className="input-box">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              required
            />
            <label>Email</label>
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-box">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "input-error" : ""}
              maxLength="10"
              required
            />
            <label>Phone</label>
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="input-box password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
              required
            />
            <label>Password</label>

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="input-box password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "input-error" : ""}
              required
            />
            <label>Confirm Password</label>

            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>

          <button className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="extra">
            Already have an account? <Link to="/Login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;