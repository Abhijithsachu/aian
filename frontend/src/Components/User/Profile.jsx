import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../api";

function Profile() {
  const navigate = useNavigate();

  const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Invalid user data in localStorage", error);
      }
    }

    return {
      name: "",
      email: "",
      phone: "",
      address: "",
    };
  };

  const [user, setUser] = useState(getStoredUser);
  const [editAddress, setEditAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(() => getStoredUser().address || "");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  const handleAddressSave = async () => {
  try {
    if (!newAddress.trim()) {
      toast.error("Address cannot be empty");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await api.put(
      "/users/update-address",
      {
        address: newAddress,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedUser = res.data.user;

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setEditAddress(false);
    toast.success("Address updated successfully");
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to update address");
  }
};

  const handleAddressCancel = () => {
    setNewAddress(user.address || "");
    setEditAddress(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="profile-page">
      <div className="profile-overlay"></div>

      <div className="profile-card">
        <button className="Profile-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="profile-header">
          <FaUserCircle className="profile-main-icon" />
          <h2>{user.name || "User Profile"}</h2>
          <p>Welcome to your AiAn Jewels account</p>
        </div>

        <div className="profile-info">
          <div className="profile-info-item">
            <div className="info-icon">
              <FaUserCircle />
            </div>

            <div>
              <span>Full Name</span>
              <h4>{user.name || "Not available"}</h4>
            </div>
          </div>

          <div className="profile-info-item">
            <div className="info-icon">
              <FaEnvelope />
            </div>

            <div>
              <span>Email Address</span>
              <h4>{user.email || "Not available"}</h4>
            </div>
          </div>

          <div className="profile-info-item">
            <div className="info-icon">
              <FaPhoneAlt />
            </div>

            <div>
              <span>Phone Number</span>
              <h4>{user.phone || "Not available"}</h4>
            </div>
          </div>

          <div className="profile-info-item address-item">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>

            <div className="address-content">
              <div className="address-title-row">
                <span>Address</span>

                {!editAddress && (
                  <button
                    className="edit-address-btn"
                    onClick={() => setEditAddress(true)}
                    title="Edit Address"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>

              {!editAddress ? (
                <h4>{user.address || "Not available"}</h4>
              ) : (
                <div className="address-edit-box">
                  <textarea
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter your address"
                  ></textarea>

                  <div className="address-edit-actions">
                    <button
                      className="save-address-btn"
                      onClick={handleAddressSave}
                    >
                      <FaSave /> Save
                    </button>

                    <button
                      className="cancel-address-btn"
                      onClick={handleAddressCancel}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {/* <button className="orders-btn" onClick={() => navigate("/Orders")}>
            My Orders
          </button> */}

          {/* <button className="cart-btn" onClick={() => navigate("/Cart")}>
            My Cart
          </button> */}

          <button className="logout-profile-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;