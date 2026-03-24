"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const colors = {
    primary: "rgba(178, 60, 47, 1)",
    background: "rgba(251, 244, 236, 1)",
    text: "rgba(69, 50, 26, 1)",
    card: "rgba(69, 50, 26, 1)",
    cream: "rgba(251, 244, 236, 1)",
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(list);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>

        <div className="min-h-screen p-6 bg-[rgba(251,244,236,1)]">

          {/* TITLE */}
          <h1
            className="text-2xl font-bold mb-6"
            style={{ color: colors.primary }}
          >
            Orders 📦
          </h1>

          <div className="space-y-4">

            {orders.length === 0 ? (
              <p style={{ color: colors.text }}>
                No orders found
              </p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-xl shadow-md hover:shadow-xl transition border"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: "rgba(251,244,236,0.2)",
                  }}
                >

                  {/* USER INFO */}
                  <p style={{ color: colors.cream }}>
                    <strong>User:</strong> {order.email}
                  </p>

                  <p style={{ color: colors.cream }}>
                    <strong>Total:</strong> Rs {order.total}
                  </p>

                  {/* STATUS */}
                  <div className="mt-2">
                    <span
                      className={`px-3 py-1 rounded text-white text-sm ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* ITEMS */}
                  {order.items && (
                    <div className="mt-3">
                      <p className="font-semibold text-[rgba(251,244,236,1)]">
                        Items:
                      </p>
                      <ul className="list-disc ml-5 text-sm text-[rgba(251,244,236,0.85)]">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.name} ({item.type || "full"}) ×{" "}
                            {item.quantity || 1}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-wrap gap-2 mt-4">

                    <button
                      onClick={() => updateStatus(order.id, "pending")}
                      className="px-3 py-1 rounded text-sm font-medium transition hover:scale-105"
                      style={{
                        backgroundColor: "#f59e0b",
                        color: "white",
                      }}
                    >
                      Pending
                    </button>

                    <button
                      onClick={() => updateStatus(order.id, "processing")}
                      className="px-3 py-1 rounded text-sm font-medium transition hover:scale-105"
                      style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                      }}
                    >
                      Processing
                    </button>

                    <button
                      onClick={() => updateStatus(order.id, "delivered")}
                      className="px-3 py-1 rounded text-sm font-medium transition hover:scale-105"
                      style={{
                        backgroundColor: "#16a34a",
                        color: "white",
                      }}
                    >
                      Delivered
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>
        </div>

      </AdminLayout>
    </ProtectedRoute>
  );
}