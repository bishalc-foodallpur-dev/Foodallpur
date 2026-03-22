"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Burger", price: 200, qty: 1 },
    { id: 2, name: "Pizza", price: 500, qty: 2 },
  ]);

  const updateQty = (id, type) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty:
                type === "inc"
                  ? item.qty + 1
                  : item.qty > 1
                  ? item.qty - 1
                  : 1,
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <main className="min-h-screen bg-[rgba(251,244,236,1)] pt-24 px-6">

      {/* Title */}
      <h1 className="text-3xl font-bold text-[rgba(178,60,47,1)] mb-10 text-center flex items-center justify-center gap-2">
        <ShoppingCart size={24} /> Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-[rgba(69,50,26,1)]">
          Your cart is empty.

          <div className="mt-6">
            <Link
              href="/menu"
              className="bg-[rgba(178,60,47,1)] text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition"
            >
              Go to Menu
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Cart Items */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              
              {/* Item Info */}
              <div>
                <h2 className="text-lg font-semibold text-[rgba(69,50,26,1)]">
                  {item.name}
                </h2>
                <p className="text-sm text-[rgba(178,60,47,1)] font-medium">
                  Rs {item.price}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                
                <button
                  onClick={() => updateQty(item.id, "dec")}
                  className="p-2 bg-[rgba(178,60,47,1)] text-white rounded-lg hover:scale-110 transition"
                >
                  <Minus size={16} />
                </button>

                <span className="font-semibold text-[rgba(69,50,26,1)] w-6 text-center">
                  {item.qty}
                </span>

                <button
                  onClick={() => updateQty(item.id, "inc")}
                  className="p-2 bg-[rgba(178,60,47,1)] text-white rounded-lg hover:scale-110 transition"
                >
                  <Plus size={16} />
                </button>

              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="flex items-center gap-1 text-[rgba(178,60,47,1)] hover:underline"
              >
                <Trash2 size={16} />
                Remove
              </button>

            </div>
          ))}

          {/* Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-10">

            <div className="flex justify-between mb-6">
              <span className="font-semibold text-[rgba(69,50,26,1)]">
                Total:
              </span>
              <span className="text-[rgba(178,60,47,1)] font-bold text-xl">
                Rs {total}
              </span>
            </div>

            <button className="w-full bg-[rgba(178,60,47,1)] text-white py-3 rounded-lg shadow hover:scale-105 transition flex items-center justify-center gap-2">
              <ShoppingCart size={18} />
              Proceed to Checkout
            </button>

          </div>

        </div>
      )}
    </main>
  );
}