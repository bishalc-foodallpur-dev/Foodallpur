"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function Admin() {
  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-[rgba(251,244,236,1)] p-6 pt-24">

        <h1 className="text-3xl font-bold text-[rgba(178,60,47,1)] mb-8 text-center">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Manage Foods */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
            <h2 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-4">
              🍔 Manage Foods
            </h2>

            <p className="text-[rgba(69,50,26,1)] text-sm mb-6">
              Add, edit, or delete food items.
            </p>

            <button className="bg-[rgba(178,60,47,1)] text-white px-6 py-2 rounded-lg hover:scale-105 transition">
              Add Food
            </button>
          </div>

          {/* Manage Orders */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
            <h2 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-4">
              📦 Manage Orders
            </h2>

            <p className="text-[rgba(69,50,26,1)] text-sm mb-6">
              View and update orders.
            </p>

            <button className="bg-[rgba(69,50,26,1)] text-white px-6 py-2 rounded-lg hover:scale-105 transition">
              View Orders
            </button>
          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}