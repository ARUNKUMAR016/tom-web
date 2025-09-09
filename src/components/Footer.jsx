// src/components/Footer.jsx
import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#253428] text-[#CDBF9C]">
      {/* Top accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#253428] via-[#728175] to-[#253428]" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3 items-start">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="cutive-font text-2xl">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-[2px] text-[#728175]" />
                <a
                  href="https://maps.app.goo.gl/by2HLDymUM9L14kR6"
                  target="_blank"
                  rel="noreferrer"
                  className="cutive-font hover:text-[#728175] transition"
                >
                  Madängsvägen 7, 129 49 Hägersten, Stockholm, Sweden
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-[#728175]" />
                <a
                  href="tel:+46734991206"
                  className="cutive-font hover:text-[#728175] transition"
                >
                  +46-734991206
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-[#728175]" />
                <a
                  href="mailto:info@tasteofmadurai.com"
                  className="cutive-font hover:text-[#728175] transition"
                >
                  info@tasteofmadurai.com
                </a>
              </li>
            </ul>
          </div>

          {/* Brand + Social */}
          <div className="text-center md:text-left space-y-3">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <img
                src="/logo1 (2).svg"
                alt="Taste of Madurai Logo"
                className="h-10 w-10 object-contain"
                style={{
                  filter:
                    "invert(88%) sepia(19%) saturate(295%) hue-rotate(360deg) brightness(95%) contrast(90%)",
                }}
              />

              <h1 className="cutive-font text-2xl">TOM — Taste of Madurai</h1>
            </div>
            <p className="cutive-font text-sm text-[#CDBF9C]/80">
              Classic South Indian cuisine rooted in Madurai’s rich food
              culture. Pickup or delivery via Foodora.
            </p>
            <div className="flex justify-center md:justify-start gap-4 text-lg">
              <a
                href="https://www.instagram.com/taste_ofmadurai"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-[#728175] transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/tasteofmadurai"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="hover:text-[#728175] transition"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="md:text-right space-y-2">
            <h3 className="cutive-font text-2xl">Opening Hours</h3>
            <p className="cutive-font">Saturday & Sunday</p>
            <p className="cutive-font">10:00 – 19:00</p>
            <div className="pt-2">
              <a
                href="http://foodora.se/restaurant/vbdi/taste-of-madurai"
                target="_blank"
                rel="noreferrer"
                className="cutive-font inline-block rounded-full bg-[#CDBF9C] text-[#253428] px-4 py-2 text-sm font-medium hover:bg-[#728175] hover:text-white transition"
              >
                Order via Foodora
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-[#CDBF9C]/20" />

        {/* Bottom links */}
        <div className="text-center text-sm text-[#CDBF9C]/75 space-y-2 cutive-font">
          <p className="space-x-3">
            <a href="/feedback" className="hover:text-[#728175] transition">
              Feedback
            </a>
            <span>·</span>
            <a href="/careers" className="hover:text-[#728175] transition">
              Careers
            </a>
            <span>·</span>
            <a href="/sv" className="hover:text-[#728175] transition" lang="sv">
              Svenska
            </a>
            <span>/</span>
            <a href="/en" className="hover:text-[#728175] transition" lang="en">
              English
            </a>
          </p>
          <p>
            © {new Date().getFullYear()} Taste of Madurai. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
