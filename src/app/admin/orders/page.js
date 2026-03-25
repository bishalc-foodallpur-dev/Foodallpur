"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    primary: "rgba(178,60,47,1)",
    bg: "rgba(251,244,236,1)",
    dark: "rgba(69,50,26,1)",
  };

  // ✅ Fetch orders
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      data.sort(
        (a, b) =>
          (b.createdAt?.seconds || 0) -
          (a.createdAt?.seconds || 0)
      );

      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Reorder
  const handleReorder = (items) => {
    items.forEach((item) => addToCart(item));
    alert("🛒 Added to cart!");
  };

  // ✅ Loading states
  if (authLoading || loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen px-4 py-10"
        style={{ backgroundColor: colors.bg }}
      >
        {/* HEADER */}
        <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center">
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.primary }}
          >
            📜 Order History
          </h1>

          <Link
            href="/profile"
            className="px-3 py-1 rounded text-white text-sm"
            style={{ backgroundColor: colors.primary }}
          >
            ← Back
          </Link>
        </div>

        {/* EMPTY */}
        {orders.length === 0 ? (
          <p className="text-center" style={{ color: colors.dark }}>
            No orders found
          </p>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-white rounded shadow"
              >
                {/* TOP */}
                <div className="flex justify-between mb-2">
                  <span style={{ color: colors.dark }}>
                    #{order.id.slice(0, 6)}
                  </span>

                  <span style={{ color: colors.primary }}>
                    {order.status}
                  </span>
                </div>

                {/* ITEMS */}
                {order.items?.map((item, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    {item.name} × {item.quantity}
                  </p>
                ))}

                {/* TOTAL */}
                <p className="font-semibold mt-2">
                  Rs {order.total}
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => handleReorder(order.items)}
                  className="mt-3 px-4 py-2 text-white rounded"
                  style={{ backgroundColor: colors.primary }}
                >
                  🔁 Reorder
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}