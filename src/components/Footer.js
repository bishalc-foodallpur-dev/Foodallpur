"use client";

import { Facebook, Instagram, Linkedin, Music2 } from "lucide-react";

export default function Footer() {
  const colors = {
    primary: "rgba(178, 60, 47, 1)",
    bg: "rgba(251, 244, 236, 1)",
    textDark: "rgba(69, 50, 26, 1)",
    border: "rgba(69, 50, 26, 0.2)",
  };

  return (
    <footer style={{ backgroundColor: colors.bg }} className="mt-12">

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">

        {/* BRAND */}
        <div className="text-center md:text-left">
          <h2
            className="text-xl font-bold"
            style={{ color: colors.primary }}
          >
            FoodAllpur 🍽️
          </h2>
          <p className="text-sm opacity-80" style={{ color: colors.textDark }}>
            Fresh meals delivered fast to your doorstep.
          </p>
        </div>

        {/* SOCIAL ICONS */}
        <div className="flex gap-5">
          <a href="#" className="hover:text-[rgba(178,60,47,1)] transition" style={{ color: colors.textDark }}>
            <Facebook size={22} />
          </a>

          <a href="#" className="hover:text-[rgba(178,60,47,1)] transition" style={{ color: colors.textDark }}>
            <Instagram size={22} />
          </a>

          <a
            href="https://www.linkedin.com/in/bishal-chaudhary-b20b66395"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[rgba(178,60,47,1)] transition"
            style={{ color: colors.textDark }}
          >
            <Linkedin size={22} />
          </a>

          <a href="#" className="hover:text-[rgba(178,60,47,1)] transition" style={{ color: colors.textDark }}>
            <Music2 size={22} /> {/* TikTok alternative icon */}
          </a>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div
        className="border-t text-center py-4 text-sm"
        style={{
          borderColor: colors.border,
          color: colors.textDark,
        }}
      >
        © {new Date().getFullYear()} FoodAllpur | Site by{" "}
        <a
          href="https://www.linkedin.com/in/bishal-chaudhary-b20b66395"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[rgba(178,60,47,1)] transition"
        >
          Bishal Chaudhary
        </a>
      </div>

    </footer>
  );
}