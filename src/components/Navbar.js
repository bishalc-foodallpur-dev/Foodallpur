"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Cart
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
  X,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Firebase auth listener
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (isMounted) {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isAdmin = user?.email === "bishalc.foodallpur@gmail.com";

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
  };

  const linkClass = (path) =>
    `flex items-center gap-2 transition ${
      pathname === path
        ? "text-[rgba(178,60,47,1)] font-semibold"
        : "text-[rgba(69,50,26,1)] hover:text-[rgba(178,60,47,1)]"
    }`;

  if (loading) {
    return (
      <nav className="bg-[rgba(251,244,236,1)] h-20 flex items-center fixed top-0 left-0 w-full z-50 shadow-sm border-b border-[rgba(69,50,26,0.1)]">
        <div className="px-6 text-[rgba(69,50,26,1)]">Loading...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-[rgba(251,244,236,1)] shadow-sm border-b border-[rgba(69,50,26,0.1)] h-20 flex items-center fixed top-0 left-0 w-full z-50">

      <div className="flex justify-between items-center w-full px-6">

        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={140}
            height={140}
            priority
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          <Link href="/" className={linkClass("/")}>
            <Home size={18} /> Home
          </Link>

          <Link href="/menu" className={linkClass("/menu")}>
            <MenuIcon size={18} /> Menu
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 text-[rgba(69,50,26,1)] hover:text-[rgba(178,60,47,1)]"
          >
            <ShoppingCart size={18} />
            Cart
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
            <Link
              href="/admin"
              className="flex items-center gap-2 bg-[rgba(178,60,47,1)] text-[rgba(251,244,236,1)] px-4 py-2 rounded-lg hover:opacity-90"
            >
              <Shield size={16} /> Admin
            </Link>
          )}

          {/* Auth */}
          {!user ? (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-[rgba(178,60,47,1)] text-[rgba(251,244,236,1)] px-4 py-2 rounded-lg hover:opacity-90"
            >
              <LogIn size={18} /> Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
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
          className="md:hidden text-[rgba(69,50,26,1)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <MenuIcon size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[rgba(69,50,26,1)] text-[rgba(251,244,236,1)] shadow-lg md:hidden">

          <div className="flex flex-col p-5 space-y-4">

            <Link href="/" className="hover:text-[rgba(178,60,47,1)]">
              Home
            </Link>

            <Link href="/menu" className="hover:text-[rgba(178,60,47,1)]">
              Menu
            </Link>

            <Link href="/cart" className="hover:text-[rgba(178,60,47,1)]">
              Cart ({cartCount})
            </Link>

            {user && (
              <Link href="/profile" className="hover:text-[rgba(178,60,47,1)]">
                Profile
              </Link>
            )}

            {isAdmin && (
              <>
                <Link href="/admin" className="hover:text-[rgba(178,60,47,1)]">
                  Admin Dashboard
                </Link>

                <Link href="/admin/add-food" className="hover:text-[rgba(178,60,47,1)]">
                  Add Food
                </Link>

                <Link href="/admin/manage-food" className="hover:text-[rgba(178,60,47,1)]">
                  Manage Food
                </Link>

                <Link href="/admin/orders" className="hover:text-[rgba(178,60,47,1)]">
                  Orders
                </Link>
              </>
            )}

            {!user ? (
              <Link
                href="/login"
                className="text-[rgba(178,60,47,1)] font-semibold"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-left hover:text-[rgba(178,60,47,1)]"
              >
                Logout
              </button>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}