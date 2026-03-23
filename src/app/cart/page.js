"use client";

import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    const user = auth.currentUser;

    if (!user) return alert("Please login first");

    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      email: user.email,
      items: cart,
      total,
      status: "pending",
      createdAt: new Date(),
    });

    alert("Order placed!");
    clearCart();
  };

  return (
    <div className="min-h-screen pt-24 p-6 bg-[rgba(251,244,236,1)]">

      <h1 className="text-3xl font-bold text-center text-[rgba(178,60,47,1)] mb-6">
        Cart 🛒
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">

        {cart.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">

            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p>${item.price}</p>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="px-2 bg-gray-200 rounded"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <img
              src={item.image}
              className="w-16 h-16 object-cover rounded"
            />
          </div>
        ))}

        <div className="text-right font-bold text-lg">
          Total: ${total}
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-[rgba(178,60,47,1)] text-white py-3 rounded-lg"
        >
          Checkout
        </button>

      </div>
    </div>
  );
}