"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query
} from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // ✅ Real-time listener
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(data);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Update status
  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        status
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // ✅ Delete order
  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;

    try {
      await deleteDoc(doc(db, "orders", id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen pt-24 p-6 bg-[rgba(251,244,236,1)]">

        <h1 className="text-3xl font-bold text-center text-[rgba(178,60,47,1)] mb-6">
          Orders 📦
        </h1>

        <div className="max-w-5xl mx-auto space-y-4">

          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white p-5 rounded-lg shadow">

                {/* User Info */}
                <div className="mb-2">
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Address:</strong> {order.address || "N/A"}</p>
                  <p><strong>Total:</strong> ${order.total}</p>
                </div>

                {/* Date */}
                <p className="text-sm text-gray-500">
                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleString()
                    : "No date"}
                </p>

                {/* Status */}
                <p className="mt-1">
                  <strong>Status:</strong>{" "}
                  <span className="font-semibold text-[rgba(178,60,47,1)]">
                    {order.status}
                  </span>
                </p>

                {/* Items */}
                <div className="mt-3 border-t pt-2">
                  {order.items?.map((item, i) => (
                    <p key={i}>
                      🍔 {item.name} × {item.quantity} = ${item.price * item.quantity}
                    </p>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4">

                  <button
                    onClick={() => updateStatus(order.id, "Pending")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => updateStatus(order.id, "Preparing")}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Preparing
                  </button>

                  <button
                    onClick={() => updateStatus(order.id, "Out for Delivery")}
                    className="bg-purple-500 text-white px-3 py-1 rounded"
                  >
                    Out for Delivery
                  </button>

                  <button
                    onClick={() => updateStatus(order.id, "Delivered")}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Delivered
                  </button>

                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </ProtectedRoute>
  );
}