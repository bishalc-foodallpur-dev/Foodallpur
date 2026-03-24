"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const colors = {
    primary: "rgba(178, 60, 47, 1)",
    background: "rgba(251, 244, 236, 1)",
    text: "rgba(69, 50, 26, 1)",
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

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>

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
                className="bg-white p-5 shadow rounded border"
                style={{ borderColor: colors.primary + "20" }}
              >

                {/* User Info */}
                <p style={{ color: colors.text }}>
                  <strong>User:</strong> {order.userEmail}
                </p>

                <p style={{ color: colors.text }}>
                  <strong>Total:</strong> Rs {order.total}
                </p>

                {/* Status Badge */}
                <p className="mt-2">
                  <span
                    className={`px-3 py-1 rounded text-white text-sm ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </p>

                {/* Items */}
                {order.items && (
                  <div className="mt-3">
                    <p className="font-semibold">Items:</p>
                    <ul className="list-disc ml-5 text-sm">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} ({item.selectedSize}) x {item.quantity || 1}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4">

                  <button
                    onClick={() => updateStatus(order.id, "pending")}
                    className="px-3 py-1 rounded text-white"
                    style={{ backgroundColor: "#f59e0b" }}
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => updateStatus(order.id, "processing")}
                    className="px-3 py-1 rounded text-white"
                    style={{ backgroundColor: "#3b82f6" }}
                  >
                    Processing
                  </button>

                  <button
                    onClick={() => updateStatus(order.id, "delivered")}
                    className="px-3 py-1 rounded text-white"
                    style={{ backgroundColor: "#16a34a" }}
                  >
                    Delivered
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </AdminLayout>
    </ProtectedRoute>
  );
}