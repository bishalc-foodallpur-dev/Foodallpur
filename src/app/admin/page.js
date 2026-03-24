"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

function AdminCard({ title, children }) {
  return (
    <div
      className="p-6 rounded-xl shadow-md hover:shadow-xl transition border"
      style={{
        backgroundColor: "rgba(69,50,26,1)",
        borderColor: "rgba(251,244,236,0.2)",
      }}
    >
      <h2
        className="mb-4 font-semibold text-lg"
        style={{ color: "rgba(251,244,236,1)" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>
        <div className="min-h-screen p-6" style={{ backgroundColor: "rgba(251,244,236,1)" }}>

          <h1 className="text-3xl font-bold mb-8" style={{ color: "rgba(178,60,47,1)" }}>
            Admin Dashboard
          </h1>

          <div className="grid md:grid-cols-2 gap-6">

            <AdminCard title="🍔 Foods">
              <Link href="/admin/add-food">
                <button
                  className="px-4 py-2 rounded font-medium transition hover:scale-105"
                  style={{
                    backgroundColor: "rgba(178,60,47,1)",
                    color: "rgba(251,244,236,1)",
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
                    backgroundColor: "rgba(251,244,236,1)",
                    color: "rgba(69,50,26,1)",
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
                    backgroundColor: "rgba(178,60,47,1)",
                    color: "rgba(251,244,236,1)",
                  }}
                >
                  Manage
                </button>
              </Link>
            </AdminCard>

          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}