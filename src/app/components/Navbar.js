"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">FoodAllpur</h1>

      <div className="space-x-6">
        <Link href="/">Home</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/admin">Admin Panel</Link>
      </div>
    </nav>
  );
}