import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "./api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setServerError("");
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setServerError("");

      const response = await api.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      // console.log("LOGIN RESPONSE:", response.data);

      const loggedUser = response.data.user || response.data;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      if (loggedUser.isAdmin === true) {
        navigate("/Adminhome");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);

      setServerError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h2 className="title">Welcome Back</h2>

        <form onSubmit={handleSubmit} noValidate>
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
          </div>

          {errors.email && <p className="field-error">{errors.email}</p>}

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
          </div>

          {errors.password && <p className="field-error">{errors.password}</p>}

          {serverError && <p className="message-box error">{serverError}</p>}

          <button className="login-submit-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="extra">
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;