"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AddFood() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "foods"), {
      name: form.name,
      price: Number(form.price),
      image: form.image,
      createdAt: new Date(),
    });

    alert("Food added!");
    setForm({ name: "", price: "", image: "" });
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>

        <h1 className="text-2xl font-bold mb-6">Add Food</h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

          <input
            type="text"
            placeholder="Food Name"
            className="w-full p-2 border"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 border"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="text"
            placeholder="Image URL"
            className="w-full p-2 border"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          {form.image && (
            <img src={form.image} alt="preview" className="w-32 h-32 object-cover" />
          )}

          <button className="bg-red-600 text-white px-4 py-2 rounded">
            Add Food
          </button>

        </form>

      </AdminLayout>
    </ProtectedRoute>
  );
}