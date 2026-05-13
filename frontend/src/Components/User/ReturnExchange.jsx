import React from "react";
import "./ReturnExchange.css";
import { useNavigate } from "react-router-dom";
import {
  FaUndoAlt,
  FaArrowLeft,
  FaBoxOpen,
  FaClock,
  FaExchangeAlt,
  FaTimesCircle,
  FaTruck,
  FaCheckCircle,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

function ReturnExchange() {
  const navigate = useNavigate();

  return (
    <div className="return-page">
      <div className="return-container">
        {/* BACK BUTTON */}
        <button className="return-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        {/* HEADER */}
        <div className="return-header">
          <FaUndoAlt className="return-main-icon" />
          <h1>Return & Exchange Policy</h1>
          <p>
            We want you to be happy with your purchase. Please read our return
            and exchange policy carefully before placing an order.
          </p>
        </div>

        {/* POLICY CARDS */}
        <div className="return-grid">
          <div className="return-card">
            <FaClock className="return-icon" />
            <h3>Return Request Time</h3>
            <p>
              Return or exchange requests must be raised within 24 hours of
              receiving the product.
            </p>
          </div>

          <div className="return-card">
            <FaBoxOpen className="return-icon" />
            <h3>Product Condition</h3>
            <p>
              Products must be unused, unworn, undamaged, and returned with
              original packaging.
            </p>
          </div>

          <div className="return-card">
            <FaExchangeAlt className="return-icon" />
            <h3>Exchange Option</h3>
            <p>
              Eligible items can be exchanged for the same product or another
              available product of equal value.
            </p>
          </div>

          <div className="return-card">
            <FaTimesCircle className="return-icon" />
            <h3>Non-Returnable Items</h3>
            <p>
              Customized, used, damaged-by-customer, or hygiene-sensitive items
              may not be eligible for return.
            </p>
          </div>

          <div className="return-card">
            <FaTruck className="return-icon" />
            <h3>Return Shipping</h3>
            <p>
              Customers may need to pay return shipping charges unless the
              product received is damaged or wrong.
            </p>
          </div>

          <div className="return-card">
            <FaCheckCircle className="return-icon" />
            <h3>Approval Process</h3>
            <p>
              Returns and exchanges will be approved after checking product
              condition and order details.
            </p>
          </div>
        </div>

        {/* NOTE */}
        <div className="return-note">
          <h2>Damaged or Wrong Product</h2>
          <p>
            If you receive a damaged, defective, or wrong product, please contact
            us immediately with your order details and clear photos or video of
            the product and package. After verification, we will arrange a
            replacement or suitable solution.
          </p>
        </div>

        <div className="return-note">
          <h2>Important Note</h2>
          <p>
            Please do not send any product back without contacting us first.
            Returns sent without approval may not be accepted. Refunds, if
            applicable, will be processed only after we receive and inspect the
            returned product.
          </p>
        </div>

        {/* CONTACT */}
        <div className="return-contact">
          <h2>Need Help?</h2>
          <p>For return or exchange requests, contact us:</p>

          <div className="return-contact-row">
            <span>
              <FaEnvelope /> hello@aianjewels.com
            </span>
            <span>
              <FaPhoneAlt /> +91 9567659841
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnExchange;