"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AddFood() {
  const [form, setForm] = useState({
    name: "",
    halfPrice: "",
    fullPrice: "",
    image: "",
    category: "",
  });

  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Default categories
  const categories = ["pizza", "burger", "drinks", "momo", "snacks", "other"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 👉 Use custom category if "other"
    const finalCategory =
      form.category === "other" ? customCategory : form.category;

    if (
      !form.name ||
      !form.halfPrice ||
      !form.fullPrice ||
      !form.image ||
      !finalCategory
    ) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await addDoc(collection(db, "foods"), {
        name: form.name,
        halfPrice: Number(form.halfPrice),
        fullPrice: Number(form.fullPrice),
        image: form.image,
        category: finalCategory.toLowerCase(), // ✅ normalize
        createdAt: serverTimestamp(),
      });

      setMessage("✅ Food added successfully!");

      setForm({
        name: "",
        halfPrice: "",
        fullPrice: "",
        image: "",
        category: "",
      });

      setCustomCategory("");

    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6">Add Food</h1>

        {message && (
          <p className="mb-4 text-center font-medium">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

          {/* Name */}
          <input
            type="text"
            placeholder="Food Name"
            className="w-full p-3 border rounded"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* Half Price */}
          <input
            type="number"
            placeholder="Half Price"
            className="w-full p-3 border rounded"
            value={form.halfPrice}
            onChange={(e) =>
              setForm({ ...form, halfPrice: e.target.value })
            }
          />

          {/* Full Price */}
          <input
            type="number"
            placeholder="Full Price"
            className="w-full p-3 border rounded"
            value={form.fullPrice}
            onChange={(e) =>
              setForm({ ...form, fullPrice: e.target.value })
            }
          />

          {/* Category Select */}
          <select
            className="w-full p-3 border rounded"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>

          {/* 👉 Custom Category Input */}
          {form.category === "other" && (
            <input
              type="text"
              placeholder="Enter new category"
              className="w-full p-3 border rounded"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          )}

          {/* Image */}
          <input
            type="text"
            placeholder="Image URL"
            className="w-full p-3 border rounded"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />

          {/* Preview */}
          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="w-32 h-32 object-cover rounded border"
            />
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white ${
              loading
                ? "bg-gray-400"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Adding..." : "Add Food"}
          </button>

        </form>
      </AdminLayout>
    </ProtectedRoute>
  );
}