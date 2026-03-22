"use client";

import { PlusCircle, ClipboardList, Shield } from "lucide-react";

export default function Admin() {
  const isAdmin = true; // later connect with auth

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgba(251,244,236,1)]">
        <h1 className="text-red-500 text-xl font-semibold">
          Access Denied
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgba(251,244,236,1)] p-6 pt-24">

      {/* Header */}
      <h1 className="text-3xl font-bold text-[rgba(178,60,47,1)] mb-10 text-center flex items-center justify-center gap-2">
        <Shield size={24} /> Admin Dashboard
      </h1>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

        {/* Manage Foods */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 text-center">

          <PlusCircle size={32} className="mx-auto text-[rgba(178,60,47,1)] mb-4" />

          <h2 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-3">
            Manage Foods
          </h2>

          <p className="text-[rgba(69,50,26,1)] text-sm mb-6">
            Add, edit, or remove food items from your menu.
          </p>

          <button className="flex items-center justify-center gap-2 bg-[rgba(178,60,47,1)] text-white px-6 py-2 rounded-lg hover:scale-105 transition w-full">
            <PlusCircle size={18} />
            Add Food
          </button>

        </div>

        {/* Manage Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 text-center">

          <ClipboardList size={32} className="mx-auto text-[rgba(178,60,47,1)] mb-4" />

          <h2 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-3">
            Manage Orders
          </h2>

          <p className="text-[rgba(69,50,26,1)] text-sm mb-6">
            View and update customer orders and delivery status.
          </p>

          <button className="flex items-center justify-center gap-2 bg-[rgba(69,50,26,1)] text-white px-6 py-2 rounded-lg hover:scale-105 transition w-full">
            <ClipboardList size={18} />
            View Orders
          </button>

        </div>

      </div>
    </div>
  );
}