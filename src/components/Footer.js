"use client";

import Link from "next/link";
import { Facebook, Instagram, Phone, Mail } from "lucide-react";

export default function Footer() {
  const colors = {
    primary: "rgba(178, 60, 47, 1)",
    bgDark: "rgba(69, 50, 26, 1)",
    textLight: "rgba(251,244,236,1)",
  };

  return (
    <footer style={{ backgroundColor: colors.bgDark }} className="text-white mt-16">

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: colors.textLight }}>
            FoodAllpur 🍽️
          </h2>
          <p className="text-sm opacity-80">
            Order fresh meals and enjoy hot, tasty food at your doorstep with just a few clicks.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-[rgba(178,60,47,1)] transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/menu" className="hover:text-[rgba(178,60,47,1)] transition">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-[rgba(178,60,47,1)] transition">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[rgba(178,60,47,1)] transition">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>

          <div className="flex items-center gap-2 text-sm mb-2">
            <Phone size={16} />
            <span>+977 9800000000</span>
          </div>

          <div className="flex items-center gap-2 text-sm mb-2">
            <Mail size={16} />
            <span>support@foodallpur.com</span>
          </div>

          {/* SOCIAL */}
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-[rgba(178,60,47,1)] transition">
              <Facebook />
            </a>
            <a href="#" className="hover:text-[rgba(178,60,47,1)] transition">
              <Instagram />
            </a>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/20 text-center py-4 text-sm opacity-70">
        © {new Date().getFullYear()} FoodAllpur. All rights reserved.
      </div>

    </footer>
  );
}