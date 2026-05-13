import React from "react";
import "./ShippingPolicy.css";
import { useNavigate } from "react-router-dom";
import {
  FaTruck,
  FaBoxOpen,
  FaClock,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaSearchLocation,
  FaExclamationTriangle,
  FaEnvelope,
  FaPhoneAlt,
  FaArrowLeft,
} from "react-icons/fa";

function ShippingPolicy() {
  const navigate = useNavigate();

  return (
    <div className="shipping-page">
      <div className="shipping-container">
        {/* BACK BUTTON */}
        <button className="Shipping-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        {/* HEADER */}
        <div className="shipping-header">
          <FaTruck className="shipping-main-icon" />
          <h1>Shipping Policy</h1>
          <p>
            We deliver your orders safely through India Post / Post Office
            services across India.
          </p>
        </div>

        {/* POLICY CARDS */}
        <div className="shipping-grid">
          <div className="shipping-card">
            <FaBoxOpen className="policy-icon" />
            <h3>Shipping Method</h3>
            <p>
              All products are shipped through India Post / Post Office
              services.
            </p>
          </div>

          <div className="shipping-card">
            <FaClock className="policy-icon" />
            <h3>Processing Time</h3>
            <p>
              Orders are processed within 1–3 business days after payment
              confirmation.
            </p>
          </div>

          <div className="shipping-card">
            <FaMapMarkerAlt className="policy-icon" />
            <h3>Delivery Time</h3>
            <p>
              Standard delivery usually takes 5–10 business days depending on
              your location.
            </p>
          </div>

          <div className="shipping-card">
            <FaRupeeSign className="policy-icon" />
            <h3>Shipping Charges</h3>
            <p>
              Shipping charges, if applicable, will be clearly message you.
            </p>
          </div>

          <div className="shipping-card">
            <FaSearchLocation className="policy-icon" />
            <h3>Order Tracking</h3>
            <p>
              Once shipped, tracking details will be shared if available from
              India Post.
            </p>
          </div>

          <div className="shipping-card">
            <FaExclamationTriangle className="policy-icon" />
            <h3>Delivery Delays</h3>
            <p>
              Delays may happen due to postal issues, holidays, weather, or
              incorrect address.
            </p>
          </div>
        </div>

        {/* IMPORTANT NOTE */}
        <div className="shipping-note">
          <h2>Important Note</h2>
          <p>
            Please make sure your shipping address and phone number are correct
            before placing the order. We are not responsible for delays or
            failed delivery caused by incorrect customer details.
          </p>
        </div>

        {/* CONTACT */}
        <div className="shipping-contact">
          <h2>Need Help?</h2>
          <p>For shipping-related questions, contact us:</p>

          <div className="contact-row">
            <span>
              <FaEnvelope /> support@yourstore.com
            </span>
            <span>
              <FaPhoneAlt /> +91-9567659841
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingPolicy;