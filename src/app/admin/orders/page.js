"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen pt-24 p-6 bg-[rgba(251,244,236,1)]">

        <h1 className="text-3xl font-bold text-center text-[rgba(178,60,47,1)] mb-6">
          Orders 📦
        </h1>

        <div className="max-w-4xl mx-auto space-y-4">

          {orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow">

              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Total:</strong> ${order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>

              <div className="mt-2">
                {order.items.map((item, i) => (
                  <p key={i}>🍔 {item.name} - ${item.price}</p>
                ))}
              </div>

            </div>
          ))}

        </div>

      </div>
    </ProtectedRoute>
  );
}