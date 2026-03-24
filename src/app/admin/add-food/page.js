"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AddFood() {
  const colors = {
    primary: "rgba(178,60,47,1)",
    bg: "rgba(251,244,236,1)",
    card: "rgba(69,50,26,1)",
  };

  const [form, setForm] = useState({
    name: "",
    fullPrice: "",
    halfPrice: "", // optional
    category: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // ================= CLOUDINARY UPLOAD =================
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "foodallpur");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dawgv2iso/image/upload",
      formData
    );

    return res.data.secure_url;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.fullPrice || !form.image) {
      alert("Name, Full Price and Image are required");
      return;
    }

    const imageUrl = await uploadImage(form.image);

    await addDoc(collection(db, "foods"), {
      name: form.name,
      fullPrice: Number(form.fullPrice),
      halfPrice: form.halfPrice ? Number(form.halfPrice) : null, // optional
      category: form.category,
      image: imageUrl,
      createdAt: new Date(),
    });

    alert("Food Added Successfully ✅");

    setForm({
      name: "",
      fullPrice: "",
      halfPrice: "",
      category: "",
      image: null,
    });

    setPreview(null);
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <div
          className="min-h-screen flex items-center justify-center p-6"
          style={{ backgroundColor: colors.bg }}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-6 rounded-xl shadow-lg"
            style={{ backgroundColor: colors.card }}
          >
            <h1
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: colors.bg }}
            >
              Add Food 🍔
            </h1>

            {/* IMAGE */}
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 mb-3 rounded"
              style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.primary}`,
              }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setForm({ ...form, image: file });
                setPreview(URL.createObjectURL(file));
              }}
            />

            {preview && (
              <img
                src={preview}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            {/* NAME */}
            <input
              type="text"
              placeholder="Food Name"
              className="w-full p-2 mb-3 rounded"
              style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.primary}`,
              }}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            {/* HALF PRICE (OPTIONAL) */}
            <input
              type="number"
              placeholder="Half Price (optional)"
              className="w-full p-2 mb-3 rounded"
              style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.primary}`,
              }}
              value={form.halfPrice}
              onChange={(e) =>
                setForm({ ...form, halfPrice: e.target.value })
              }
            />

            {/* FULL PRICE */}
            <input
              type="number"
              placeholder="Full Price"
              className="w-full p-2 mb-3 rounded"
              style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.primary}`,
              }}
              value={form.fullPrice}
              onChange={(e) =>
                setForm({ ...form, fullPrice: e.target.value })
              }
            />

            {/* CATEGORY (MANUAL INPUT ONLY) */}
            <input
              type="text"
              placeholder="Category (manual)"
              className="w-full p-2 mb-4 rounded"
              style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.primary}`,
              }}
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            />

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full py-2 rounded font-semibold"
              style={{
                backgroundColor: colors.primary,
                color: colors.bg,
              }}
            >
              Add Food
            </button>
          </form>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}