"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const statusOptions = [
    "Pending",
    "Cooking",
    "Out for delivery",
    "Delivered",
    "Cancelled",
  ];

  // =====================
  // REALTIME FETCH
  // =====================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // sort newest first
      data.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );

      setOrders(data);
    });

    return () => unsub();
  }, []);

  // =====================
  // UPDATE STATUS
  // =====================
  const updateStatus = async (orderId, status) => {
    await updateDoc(doc(db, "orders", orderId), { status });
  };

  // =====================
  // MARK AS PAID
  // =====================
  const markAsPaid = async (orderId) => {
    await updateDoc(doc(db, "orders", orderId), {
      paid: true,
      paymentStatus: "paid",
    });
  };

  // =====================
  // CANCEL ORDER
  // =====================
  const cancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    await updateDoc(doc(db, "orders", orderId), { status: "Cancelled" });
  };

  // =====================
  // UI COLORS
  // =====================
  const colors = {
    primary: "rgba(178, 60, 47, 1)",
    bg: "rgba(251, 244, 236, 1)",
    card: "rgba(69, 50, 26, 1)",
    text: "rgba(251,244,236,1)",
    secondaryText: "rgba(251,244,236,0.8)",
  };

  // =====================
  // UI
  // =====================
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>
        <div
          className="min-h-screen p-6"
          style={{ backgroundColor: colors.bg }}
        >
          <h1
            className="text-2xl font-bold mb-6"
            style={{ color: colors.primary }}
          >
            Admin Orders 📦
          </h1>

          {orders.length === 0 ? (
            <p style={{ color: colors.primary }}>No orders found</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-5 mb-5 rounded-xl shadow border"
                style={{
                  backgroundColor: colors.card,
                  borderColor: "rgba(251,244,236,0.2)",
                }}
              >
                {/* HEADER */}
                <div className="flex justify-between">
                  <p className="font-semibold" style={{ color: colors.text }}>
                    ID: {order.id.slice(0, 6)}
                  </p>

                  <p
                    style={{
                      color:
                        order.status === "Delivered"
                          ? "lightgreen"
                          : order.status === "Cooking"
                          ? "orange"
                          : order.status === "Out for delivery"
                          ? "skyblue"
                          : order.status === "Cancelled"
                          ? "red"
                          : "yellow",
                    }}
                  >
                    {order.status}
                  </p>
                </div>

                {/* USER */}
                <p
                  className="text-sm mt-2"
                  style={{ color: colors.secondaryText }}
                >
                  User: {order.userEmail || order.userId}
                </p>

                {/* ITEMS */}
                <div className="mt-3" style={{ color: colors.text }}>
                  {order.items?.map((item, i) => (
                    <p key={i}>
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>

                {/* TOTAL */}
                <p
                  className="font-semibold mt-2"
                  style={{ color: colors.text }}
                >
                  Total: Rs {order.total}
                </p>

                {/* STATUS BUTTONS */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(order.id, status)}
                      className="px-3 py-1 text-sm rounded transition hover:scale-105"
                      style={{
                        backgroundColor: colors.text,
                        color: colors.card,
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => markAsPaid(order.id)}
                    className="px-3 py-1 rounded text-sm"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.text,
                    }}
                  >
                    Mark Paid
                  </button>

                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="px-3 py-1 rounded text-sm"
                    style={{
                      backgroundColor: "red",
                      color: colors.text,
                    }}
                  >
                    Cancel
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