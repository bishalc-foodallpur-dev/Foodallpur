"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-[rgba(251,244,236,1)] p-6 pt-24">

        <h1 className="text-3xl font-bold text-[rgba(178,60,47,1)] mb-10 text-center">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Manage Foods */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition text-center">

            <h2 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-4">
              🍔 Manage Foods
            </h2>

            <p className="text-[rgba(69,50,26,1)] text-sm mb-6">
              Add, edit, or delete food items.
            </p>

            <button
              onClick={() => router.push("/admin/add-food")}
              className="bg-[rgba(178,60,47,1)] text-white px-6 py-2 rounded-lg hover:scale-105 transition"
            >
              Add Food
            </button>

          </div>

          {/* Manage Orders */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition text-center">

            <h2 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-4">
              📦 Manage Orders
            </h2>

            <p className="text-[rgba(69,50,26,1)] text-sm mb-6">
              View and update customer orders in real-time.
            </p>

            <button
              onClick={() => router.push("/admin/orders")}
              className="bg-[rgba(69,50,26,1)] text-white px-6 py-2 rounded-lg hover:scale-105 transition"
            >
              View Orders
            </button>

          </div>

          {/* Optional: Users / Profile Management */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition text-center">

            <h2 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-4">
              👤 Users
            </h2>

            <p className="text-[rgba(69,50,26,1)] text-sm mb-6">
              Manage users and profiles.
            </p>

            <button
              onClick={() => router.push("/admin/users")}
              className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:scale-105 transition"
            >
              View Users
            </button>

          </div>

          {/* Optional: Settings */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition text-center">

            <h2 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-4">
              ⚙️ Settings
            </h2>

            <p className="text-[rgba(69,50,26,1)] text-sm mb-6">
              Configure app settings.
            </p>

            <button
              onClick={() => router.push("/admin/settings")}
              className="bg-black text-white px-6 py-2 rounded-lg hover:scale-105 transition"
            >
              Open Settings
            </button>

          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}