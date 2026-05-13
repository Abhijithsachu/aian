import React from "react";
import "./TermsOfService.css";
import { useNavigate } from "react-router-dom";
import {
  FaFileContract,
  FaArrowLeft,
  FaUserCheck,
  FaShoppingBag,
  FaCreditCard,
  FaTruck,
  FaUndoAlt,
  FaExclamationCircle,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="terms-page">
      <div className="terms-container">
        {/* BACK BUTTON */}
        <button className="terms-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        {/* HEADER */}
        <div className="terms-header">
          <FaFileContract className="terms-main-icon" />
          <h1>Terms of Service</h1>
          <p>
            Please read these Terms of Service carefully before using our website
            or placing an order.
          </p>
        </div>

        {/* TERMS CARDS */}
        <div className="terms-grid">
          <div className="terms-card">
            <FaUserCheck className="terms-icon" />
            <h3>Acceptance of Terms</h3>
            <p>
              By accessing our website or purchasing products, you agree to
              follow these Terms of Service.
            </p>
          </div>

          <div className="terms-card">
            <FaShoppingBag className="terms-icon" />
            <h3>Products & Orders</h3>
            <p>
              Product details, prices, and availability may change without prior
              notice. Orders are subject to confirmation.
            </p>
          </div>

          <div className="terms-card">
            <FaCreditCard className="terms-icon" />
            <h3>Payments</h3>
            <p>
              Customers must provide accurate billing and payment information.
              Orders will be processed after successful payment confirmation.
            </p>
          </div>

          <div className="terms-card">
            <FaTruck className="terms-icon" />
            <h3>Shipping</h3>
            <p>
              Products are shipped through India Post / Post Office services.
              Delivery time may vary based on location and postal delays.
            </p>
          </div>

          <div className="terms-card">
            <FaUndoAlt className="terms-icon" />
            <h3>Returns & Refunds</h3>
            <p>
              Returns, replacements, or refunds are handled according to our
              return and refund policy.
            </p>
          </div>

          <div className="terms-card">
            <FaExclamationCircle className="terms-icon" />
            <h3>Incorrect Information</h3>
            <p>
              We are not responsible for failed delivery, delays, or loss caused
              by incorrect customer details.
            </p>
          </div>
        </div>

        {/* IMPORTANT NOTE */}
        <div className="terms-note">
          <h2>Use of Website</h2>
          <p>
            You agree not to misuse our website, attempt unauthorized access,
            copy website content without permission, or use our services for
            illegal activities. We reserve the right to refuse service, cancel
            orders, or restrict access if these terms are violated.
          </p>
        </div>

        <div className="terms-note">
          <h2>Limitation of Liability</h2>
          <p>
            We try our best to provide accurate product details and reliable
            service. However, we are not liable for indirect losses, postal
            delays, technical issues, or circumstances beyond our control.
          </p>
        </div>

        {/* CONTACT */}
        <div className="terms-contact">
          <h2>Contact Us</h2>
          <p>
            For questions about these Terms of Service, you can contact us:
          </p>

          <div className="terms-contact-row">
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

export default TermsOfService;