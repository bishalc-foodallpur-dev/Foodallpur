"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

function AdminCard({ title, children }) {
  return (
    <div
      className="p-6 rounded-2xl shadow-md hover:shadow-xl transition border"
      style={{
        backgroundColor: "#45321A",
        borderColor: "rgba(251,244,236,0.2)",
      }}
    >
      <h2 className="mb-4 font-semibold text-lg text-[#FBF4EC]">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function Admin() {
  const [foodsCount, setFoodsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);

  // Fetch stats
  useEffect(() => {
    const unsubFoods = onSnapshot(collection(db, "foods"), (snap) => {
      setFoodsCount(snap.size);
    });

    const unsubOrders = onSnapshot(collection(db, "orders"), (snap) => {
      setOrdersCount(snap.size);
    });

    const unsubReviews = onSnapshot(collection(db, "reviews"), (snap) => {
      setReviewsCount(snap.size);
    });

    return () => {
      unsubFoods();
      unsubOrders();
      unsubReviews();
    };
  }, []);

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>
        <div
          className="min-h-screen p-6"
          style={{ backgroundColor: "#FBF4EC" }}
        >
          <h1
            className="text-3xl font-bold mb-8"
            style={{ color: "#B23C2F" }}
          >
            Admin Dashboard
          </h1>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl shadow text-center">
              <p className="text-gray-500">Foods</p>
              <h3 className="text-2xl font-bold">{foodsCount}</h3>
            </div>

            <div className="bg-white p-5 rounded-xl shadow text-center">
              <p className="text-gray-500">Orders</p>
              <h3 className="text-2xl font-bold">{ordersCount}</h3>
            </div>

            <div className="bg-white p-5 rounded-xl shadow text-center">
              <p className="text-gray-500">Reviews</p>
              <h3 className="text-2xl font-bold">{reviewsCount}</h3>
            </div>
          </div>

          {/* ACTION CARDS */}
          <div className="grid md:grid-cols-2 gap-6">

            <AdminCard title="🍔 Foods">
              <Link href="/admin/add-food">
                <button
                  className="px-4 py-2 rounded font-medium transition hover:scale-105"
                  style={{
                    backgroundColor: "#B23C2F",
                    color: "#FBF4EC",
                  }}
                >
                  Add Food
                </button>
              </Link>
            </AdminCard>

            <AdminCard title="📦 Orders">
              <Link href="/admin/orders">
                <button
                  className="px-4 py-2 rounded font-medium transition hover:scale-105"
                  style={{
                    backgroundColor: "#FBF4EC",
                    color: "#45321A",
                  }}
                >
                  View Orders
                </button>
              </Link>
            </AdminCard>

            <AdminCard title="🍔 Manage Foods">
              <Link href="/admin/manage-food">
                <button
                  className="px-4 py-2 rounded font-medium transition hover:scale-105"
                  style={{
                    backgroundColor: "#B23C2F",
                    color: "#FBF4EC",
                  }}
                >
                  Manage Foods
                </button>
              </Link>
            </AdminCard>

            {/* NEW: REVIEWS MANAGEMENT */}
            <AdminCard title="⭐ Reviews">
              <Link href="/admin/reviews">
                <button
                  className="px-4 py-2 rounded font-medium transition hover:scale-105"
                  style={{
                    backgroundColor: "#FBF4EC",
                    color: "#45321A",
                  }}
                >
                  Manage Reviews
                </button>
              </Link>
            </AdminCard>

          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}