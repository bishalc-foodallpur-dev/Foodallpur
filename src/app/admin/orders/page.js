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

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>

        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 shadow rounded">

              <p><strong>User:</strong> {order.userEmail}</p>
              <p><strong>Total:</strong> Rs {order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>

              <div className="flex gap-2 mt-3">

                <button
                  onClick={() => updateStatus(order.id, "pending")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Pending
                </button>

                <button
                  onClick={() => updateStatus(order.id, "processing")}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Processing
                </button>

                <button
                  onClick={() => updateStatus(order.id, "delivered")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Delivered
                </button>

              </div>

            </div>
          ))}
        </div>

      </AdminLayout>
    </ProtectedRoute>
  );
}