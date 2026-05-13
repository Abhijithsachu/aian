import React from "react";
import "./Contact.css";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaArrowLeft } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function Contact() {
  const navigate = useNavigate();

  return (
    <div className="contact-page">

      {/* Back Button */}
      <button className="Contact-back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      {/* Heading */}
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you 💎</p>
      </div>

      {/* Main Section */}
      <div className="contact-container">

        {/* Left - Contact Info */}
        <div className="contact-info">
          <h3>Get In Touch</h3>

          <p className="contact-item">
            <FaMapMarkerAlt /> Malappuram, Kerala, India
          </p>

          <p className="contact-item">
            <MdEmail /> hello@aianjewels.com
          </p>

          <p className="contact-item">
            <FaPhoneAlt /> +91 9567659841
          </p>

          <a
            href="https://wa.me/919567659841"
            target="_blank"
            rel="noreferrer"
            className="whatsapp-btn"
          >
            <FaWhatsapp /> Chat on WhatsApp
          </a>
        </div>

        {/* Right - Contact Form */}
        <div className="contact-form">
          <h3>Send Message</h3>

          <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="text" placeholder="Subject" />
            <textarea placeholder="Your Message" rows="5"></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>

      </div>

      {/* Map */}
      <div className="map">
        <iframe
          src="https://www.google.com/maps?q=malappuram&output=embed"
          title="map"
          loading="lazy"
        ></iframe>
      </div>

    </div>
  );
}

export default Contact;