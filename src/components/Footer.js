"use client";

import { Facebook, Instagram, Linkedin, Music2, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const colors = {
    bg: "rgba(251,244,236,1)",  // SAME as homepage
    text: "rgba(69,50,26,1)",
    primary: "rgba(178,60,47,1)",
  };

  return (
    <footer style={{ backgroundColor: colors.bg, color: colors.text }} className="pt-16">

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: colors.primary }}>
            FoodAllpur 🍽️
          </h2>
          <p className="text-sm opacity-80">
            Fresh meals delivered fast to your doorstep.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/menu" className="hover:underline">Menu</a></li>
            <li><a href="/cart" className="hover:underline">Cart</a></li>
            <li><a href="/login" className="hover:underline">Login</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>

          <div className="flex items-center gap-2 text-sm mb-2 opacity-80">
            <MapPin size={16} /> Kathmandu, Nepal
          </div>

          <div className="flex items-center gap-2 text-sm mb-2 opacity-80">
            <Phone size={16} /> +977-98XXXXXXXX
          </div>

          <div className="flex items-center gap-2 text-sm opacity-80">
            <Mail size={16} /> support@foodallpur.com
          </div>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>

          <div className="flex gap-4">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
            <a
              href="https://www.linkedin.com/in/bishal-chaudhary-b20b66395"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} />
            </a>
            <a href="#"><Music2 size={20} /></a>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="mt-12 py-4 text-center text-sm opacity-70">
        © {new Date().getFullYear()} FoodAllpur | Built by Bishal Chaudhary
      </div>

    </footer>
  );
}