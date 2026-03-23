"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Cart Context
import { useCart } from "@/context/CartContext";

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Cart context
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 🔥 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === "bishalc.foodallpur@gmail.com"; // change if needed

  const linkClass = (path) =>
    `flex items-center gap-1 transition hover:scale-105 duration-200 ${
      pathname === path
        ? "text-[rgba(178,60,47,1)] font-semibold"
        : "text-[rgba(69,50,26,1)] hover:text-[rgba(178,60,47,1)]"
    }`;

  const handleLinkClick = () => setMenuOpen(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Prevent flicker
  if (loading) return null;

  return (
    <nav className="bg-[rgba(251,244,236,0.95)] backdrop-blur-md shadow-lg h-20 flex items-center fixed top-0 left-0 w-full z-50">
      
      <div className="flex justify-between items-center w-full px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center h-full">
          <Image
            src="/logo.png"
            alt="FoodAllpur Logo"
            width={140}
            height={140}
            className="object-contain h-16 w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">

          <Link href="/" className={linkClass("/")}>
            <Home size={18} /> Home
          </Link>

          <Link href="/menu" className={linkClass("/menu")}>
            <MenuIcon size={18} /> Menu
          </Link>

          {/* Cart with badge */}
          <Link href="/cart" className="relative flex items-center gap-1 text-[rgba(69,50,26,1)] hover:text-[rgba(178,60,47,1)]">
            <ShoppingCart size={18} /> Cart

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-[rgba(178,60,47,1)] text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          {user && (
            <Link href="/profile" className={linkClass("/profile")}>
              <User size={18} /> Profile
            </Link>
          )}

          {/* Admin */}
          {isAdmin && (
            <Link href="/admin/add-food">
              <button className="bg-[rgba(178,60,47,1)] text-white px-5 py-2 rounded-lg hover:opacity-90">
                <Shield size={16} className="inline mr-1" />
                Admin
              </button>
            </Link>
          )}

          {/* Auth */}
          {!user ? (
            <Link
              href="/login"
              className="flex items-center gap-1 bg-[rgba(178,60,47,1)] text-white px-4 py-2 rounded-lg hover:opacity-90"
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
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-[rgba(69,50,26,1)] hover:text-[rgba(178,60,47,1)]"
              >
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

          <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2">
            <Home size={18} /> Home
          </Link>

          <Link href="/menu" onClick={handleLinkClick} className="flex items-center gap-2">
            <MenuIcon size={18} /> Menu
          </Link>

          <Link href="/cart" onClick={handleLinkClick} className="flex items-center gap-2">
            <ShoppingCart size={18} /> Cart ({cartCount})
          </Link>

          {user && (
            <Link href="/profile" onClick={handleLinkClick} className="flex items-center gap-2">
              <User size={18} /> Profile
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/add-food" onClick={handleLinkClick} className="flex items-center gap-2">
              <Shield size={18} /> Admin
            </Link>
          )}

          {!user ? (
            <Link href="/login" onClick={handleLinkClick} className="flex items-center gap-2">
              <LogIn size={18} /> Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          )}

        </div>
      )}
    </nav>
  );
}