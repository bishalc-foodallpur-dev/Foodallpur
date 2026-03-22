"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Icons
import {
  Home,
  Menu as MenuIcon,
  ShoppingCart,
  User,
  Shield,
  LogIn,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = true;
  const isAdmin = true;
  const cartCount = 3;

  const linkClass = (path) =>
    `flex items-center gap-1 transition hover:scale-105 duration-200 ${
      pathname === path
        ? "text-[rgba(178,60,47,1)] font-semibold"
        : "text-[rgba(69,50,26,1)] hover:text-[rgba(178,60,47,1)]"
    }`;

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="bg-[rgba(251,244,236,0.95)] backdrop-blur-md px-6 shadow-lg h-20 flex items-center fixed top-0 left-0 w-full z-50">
      
      <div className="flex justify-between items-center w-full">
        
        {/* Logo */}
        <Link href="/" className="flex items-center h-full">
          <div className="h-16 flex items-center">
            <Image
              src="/logo.png"
              alt="FoodAllpur Logo"
              width={140}
              height={140}
              className="object-contain h-full w-auto"
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">

          <Link href="/" className={linkClass("/")}>
            <Home size={18} /> Home
          </Link>

          <Link href="/menu" className={linkClass("/menu")}>
            <MenuIcon size={18} /> Menu
          </Link>

          <Link href="/cart" className="relative flex items-center gap-1">
            <span className={linkClass("/cart")}>
              <ShoppingCart size={18} /> Cart
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-[rgba(178,60,47,1)] text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/profile" className={linkClass("/profile")}>
            <User size={18} /> Profile
          </Link>

          {isAdmin && (
            <Link href="/admin" className={linkClass("/admin")}>
              <Shield size={18} /> Admin
            </Link>
          )}

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="flex items-center gap-1 bg-[rgba(178,60,47,1)] text-white px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              <LogIn size={18} /> Login
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <Image
                src="/avatar.png"
                alt="User"
                width={32}
                height={32}
                className="rounded-full"
              />
              <button className="flex items-center gap-1 text-[rgba(69,50,26,1)] hover:text-[rgba(178,60,47,1)]">
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}

        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl text-[rgba(69,50,26,1)]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[rgba(251,244,236,0.98)] backdrop-blur-md shadow-md flex flex-col space-y-4 p-5 md:hidden border-t border-[rgba(69,50,26,0.1)]">

          <Link href="/" className={linkClass("/")} onClick={handleLinkClick}>
            <Home size={18} /> Home
          </Link>

          <Link href="/menu" className={linkClass("/menu")} onClick={handleLinkClick}>
            <MenuIcon size={18} /> Menu
          </Link>

          <Link href="/cart" onClick={handleLinkClick} className="relative flex items-center gap-1">
            <span className={linkClass("/cart")}>
              <ShoppingCart size={18} /> Cart
            </span>
            {cartCount > 0 && (
              <span className="ml-2 bg-[rgba(178,60,47,1)] text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/profile" className={linkClass("/profile")} onClick={handleLinkClick}>
            <User size={18} /> Profile
          </Link>

          {isAdmin && (
            <Link href="/admin" className={linkClass("/admin")} onClick={handleLinkClick}>
              <Shield size={18} /> Admin
            </Link>
          )}

          {!isLoggedIn ? (
            <Link
              href="/login"
              onClick={handleLinkClick}
              className="flex items-center justify-center gap-1 bg-[rgba(178,60,47,1)] text-white px-4 py-2 rounded-lg"
            >
              <LogIn size={18} /> Login
            </Link>
          ) : (
            <button className="flex items-center gap-1 text-[rgba(69,50,26,1)]">
              <LogOut size={18} /> Logout
            </button>
          )}

        </div>
      )}
    </nav>
  );
}