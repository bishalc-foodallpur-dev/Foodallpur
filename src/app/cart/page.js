"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Add default type if not present
  const cartWithType = cart.map((item) => ({
    ...item,
    type: item.type || "full", // default full
  }));

  // Price logic (half = 60% of full price, you can adjust)
  const getItemPrice = (item) => {
    if (item.type === "half") {
      return item.price * 0.6;
    }
    return item.price;
  };

  const total = cartWithType.reduce((sum, item) => {
    return sum + getItemPrice(item) * item.quantity;
  }, 0);

  const updateType = (itemId, type) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, type } : item
    );

    // Update cart manually (if your context supports it, better to expose setter)
    // fallback: reload workaround if needed
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.reload();
  };

  const handleCheckout = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        email: user.email,
        items: cartWithType,
        total,
        status: "pending",
        createdAt: new Date(),
      });

      alert("✅ Order placed successfully!");
      clearCart();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to place order");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen pt-24 p-6"
      style={{ backgroundColor: "rgba(251,244,236,1)" }}
    >
      <h1
        className="text-3xl font-bold text-center mb-6"
        style={{ color: "rgba(178,60,47,1)" }}
      >
        Cart 🛒
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          cartWithType.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center hover:shadow-md transition"
            >
              <div className="w-full">

                {/* Name */}
                <h2
                  className="font-semibold"
                  style={{ color: "rgba(69, 50, 26, 1)" }}
                >
                  {item.name}
                </h2>

                {/* Price */}
                <p className="text-sm">
                  Price:{" "}
                  <span style={{ color: "rgba(178,60,47,1)" }}>
                    Rs. {getItemPrice(item).toFixed(2)}
                  </span>
                </p>

                {/* Half / Full Toggle */}
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => updateType(item.id, "half")}
                    className={`px-3 py-1 rounded text-sm border ${
                      item.type === "half"
                        ? "bg-[rgba(178,60,47,1)] text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Half
                  </button>

                  <button
                    onClick={() => updateType(item.id, "full")}
                    className={`px-3 py-1 rounded text-sm border ${
                      item.type === "full"
                        ? "bg-[rgba(178,60,47,1)] text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Full
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span className="font-medium">{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded ml-4"
              />
            </div>
          ))
        )}

        {/* Total */}
        {cart.length > 0 && (
          <div className="text-right font-bold text-lg">
            Total:{" "}
            <span style={{ color: "rgba(178,60,47,1)" }}>
              Rs. {total.toFixed(2)}
            </span>
          </div>
        )}

        {/* Checkout */}
        {cart.length > 0 && (
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            style={{ backgroundColor: "rgba(178,60,47,1)" }}
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
        )}
      </div>
    </div>
  );
}