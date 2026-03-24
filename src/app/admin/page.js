"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

function AdminCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border border-[rgba(69,50,26,0.1)]">
      <h2 className="mb-2 font-semibold text-[rgba(69,50,26,1)]">
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
        <div className="min-h-screen bg-[rgba(251,244,236,1)] p-6">
          
          <h1 className="text-3xl font-bold mb-8 text-[rgba(178,60,47,1)]">
            Admin Dashboard
          </h1>

          <div className="grid md:grid-cols-2 gap-6">

            <AdminCard title="🍔 Foods">
              <Link href="/admin/add-food">
                <button className="bg-[rgba(178,60,47,1)] hover:opacity-90 text-white px-4 py-2 rounded">
                  Add Food
                </button>
              </Link>
            </AdminCard>

            <AdminCard title="📦 Orders">
              <Link href="/admin/orders">
                <button className="bg-[rgba(69,50,26,1)] hover:opacity-90 text-white px-4 py-2 rounded">
                  View Orders
                </button>
              </Link>
            </AdminCard>

            <AdminCard title="🍔 Manage Foods">
              <Link href="/admin/manage-food">
                <button className="bg-[rgba(178,60,47,1)] hover:opacity-90 text-white px-4 py-2 rounded">
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