import React from "react";
import "./CareInstructions.css";
import { useNavigate } from "react-router-dom";
import {
  FaGem,
  FaArrowLeft,
  FaWater,
  FaSprayCan,
  FaBox,
  FaHandsWash,
  FaSun,
  FaExclamationTriangle,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

function CareInstructions() {
  const navigate = useNavigate();

  return (
    <div className="care-page">
      <div className="care-container">
        {/* BACK BUTTON */}
        <button className="care-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        {/* HEADER */}
        <div className="care-header">
          <FaGem className="care-main-icon" />
          <h1>Care Instructions</h1>
          <p>
            Follow these simple care tips to keep your jewellery beautiful,
            shiny, and long-lasting.
          </p>
        </div>

        {/* CARE CARDS */}
        <div className="care-grid">
          <div className="care-card">
            <FaWater className="care-icon" />
            <h3>Avoid Water</h3>
            <p>
              Keep your jewellery away from water, sweat, perfume, and moisture
              to prevent fading or damage.
            </p>
          </div>

          <div className="care-card">
            <FaSprayCan className="care-icon" />
            <h3>Avoid Chemicals</h3>
            <p>
              Do not expose jewellery to perfumes, lotions, hair sprays,
              sanitizers, or cleaning products.
            </p>
          </div>

          <div className="care-card">
            <FaBox className="care-icon" />
            <h3>Store Safely</h3>
            <p>
              Store each piece separately in a jewellery box, pouch, or airtight
              cover to avoid scratches.
            </p>
          </div>

          <div className="care-card">
            <FaHandsWash className="care-icon" />
            <h3>Clean Gently</h3>
            <p>
              Wipe jewellery gently with a soft dry cloth after use. Avoid harsh
              cleaning liquids or rough cloth.
            </p>
          </div>

          <div className="care-card">
            <FaSun className="care-icon" />
            <h3>Avoid Direct Sunlight</h3>
            <p>
              Do not keep jewellery under direct sunlight or high heat for long
              periods.
            </p>
          </div>

          <div className="care-card">
            <FaExclamationTriangle className="care-icon" />
            <h3>Handle With Care</h3>
            <p>
              Avoid dropping, bending, pulling, or wearing jewellery during
              heavy work or exercise.
            </p>
          </div>
        </div>

        {/* IMPORTANT NOTE */}
        <div className="care-note">
          <h2>Important Note</h2>
          <p>
            Jewellery should be the last thing you wear before going out and the
            first thing you remove after coming home. Proper care helps maintain
            shine, color, and quality for a longer time.
          </p>
        </div>

        <div className="care-note">
          <h2>Best Practice</h2>
          <p>
            After every use, gently wipe your jewellery with a soft dry cloth and
            store it in a closed pouch or box. This helps protect it from dust,
            moisture, and scratches.
          </p>
        </div>

        {/* CONTACT */}
        <div className="care-contact">
          <h2>Need Help?</h2>
          <p>For jewellery care-related questions, contact us:</p>

          <div className="care-contact-row">
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

export default CareInstructions;