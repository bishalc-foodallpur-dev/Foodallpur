"use client";

import useAuth from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Profile() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[rgba(251,244,236,1)] pt-24 px-6 flex justify-center">

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">

          <h1 className="text-2xl font-bold text-[rgba(178,60,47,1)] mb-6 text-center">
            My Profile 👤
          </h1>

          <div className="space-y-4 text-[rgba(69,50,26,1)]">
            <p><strong>Email:</strong> {user?.email}</p>
          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}