import React from "react";
import "./PrivacyPolicy.css";
import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaArrowLeft,
  FaDatabase,
  FaLock,
  FaShoppingCart,
  FaEnvelope,
  FaPhoneAlt,
  FaShareAlt,
  FaCookieBite,
  FaEdit,
} from "react-icons/fa";

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        {/* BACK BUTTON */}
        <button className="privacy-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        {/* HEADER */}
        <div className="privacy-header">
          <FaUserShield className="privacy-main-icon" />
          <h1>Privacy Policy</h1>
          <p>
            Your privacy is important to us. This policy explains how we collect,
            use, and protect your information when you use our website.
          </p>
        </div>

        {/* POLICY CARDS */}
        <div className="privacy-grid">
          <div className="privacy-card">
            <FaDatabase className="privacy-icon" />
            <h3>Information We Collect</h3>
            <p>
              We may collect your name, email address, phone number, shipping
              address, and order details when you place an order or register.
            </p>
          </div>

          <div className="privacy-card">
            <FaShoppingCart className="privacy-icon" />
            <h3>How We Use Your Information</h3>
            <p>
              Your information is used to process orders, deliver products,
              provide support, and improve our services.
            </p>
          </div>

          <div className="privacy-card">
            <FaLock className="privacy-icon" />
            <h3>Data Protection</h3>
            <p>
              We take reasonable steps to protect your personal information from
              unauthorized access, misuse, loss, or disclosure.
            </p>
          </div>

          <div className="privacy-card">
            <FaShareAlt className="privacy-icon" />
            <h3>Sharing Information</h3>
            <p>
              We do not sell your personal information. We only share necessary
              details with delivery partners or payment service providers.
            </p>
          </div>

          <div className="privacy-card">
            <FaCookieBite className="privacy-icon" />
            <h3>Cookies</h3>
            <p>
              Our website may use cookies to improve user experience, remember
              preferences, and analyze website performance.
            </p>
          </div>

          <div className="privacy-card">
            <FaEdit className="privacy-icon" />
            <h3>Policy Updates</h3>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page.
            </p>
          </div>
        </div>

        {/* IMPORTANT NOTE */}
        <div className="privacy-note">
          <h2>Your Rights</h2>
          <p>
            You may contact us to update, correct, or request deletion of your
            personal information, subject to legal and order-related record
            requirements.
          </p>
        </div>

        {/* CONTACT */}
        <div className="privacy-contact">
          <h2>Contact Us</h2>
          <p>
            For privacy-related questions or requests, you can contact us:
          </p>

          <div className="privacy-contact-row">
            <span>
              <FaEnvelope /> support@yourstore.com
            </span>
            <span>
              <FaPhoneAlt /> +91-XXXXXXXXXX
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;