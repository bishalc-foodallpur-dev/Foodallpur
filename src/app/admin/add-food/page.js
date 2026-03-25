"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AddFood() {
  const [form, setForm] = useState({
    name: "",
    fullPrice: "",
    halfPrice: "",
    category: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ CHANGE THIS (your cloud name)
  const CLOUD_NAME = "dawgv2iso"; 
  const UPLOAD_PRESET = "foodallpur";

  // ================= IMAGE UPLOAD =================
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      console.log("UPLOAD SUCCESS:", res.data);
      return res.data.secure_url;

    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err.message);
      throw new Error("Upload failed");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.fullPrice) {
      alert("Name and Full Price required");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = null;

      // ✅ Optional image
      if (form.image) {
        try {
          imageUrl = await uploadImage(form.image);
        } catch {
          alert("Image upload failed, saving without image");
        }
      }

      await addDoc(collection(db, "foods"), {
        name: form.name,
        fullPrice: Number(form.fullPrice),
        halfPrice: form.halfPrice ? Number(form.halfPrice) : null,
        category: form.category || "Uncategorized",
        image: imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Food Added ✅");

      setForm({
        name: "",
        fullPrice: "",
        halfPrice: "",
        category: "",
        image: null,
      });

      setPreview(null);

    } catch (err) {
      console.error(err);
      alert("Error saving data ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center p-6 bg-orange-50">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white"
          >
            <h1 className="text-2xl font-bold mb-6 text-center">
              Add Food 🍔
            </h1>

            {/* IMAGE */}
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setForm((prev) => ({ ...prev, image: file }));
                setPreview(URL.createObjectURL(file));
              }}
              className="mb-3 w-full"
            />

            {preview && (
              <img
                src={preview}
                className="w-full h-40 object-cover mb-3 rounded"
              />
            )}

            {/* NAME */}
            <input
              type="text"
              placeholder="Food name"
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
              className="w-full p-2 mb-3 border rounded"
            />

            {/* HALF PRICE */}
            <input
              type="number"
              placeholder="Half price (optional)"
              value={form.halfPrice}
              onChange={(e) =>
                setForm((p) => ({ ...p, halfPrice: e.target.value }))
              }
              className="w-full p-2 mb-3 border rounded"
            />

            {/* FULL PRICE */}
            <input
              type="number"
              placeholder="Full price"
              value={form.fullPrice}
              onChange={(e) =>
                setForm((p) => ({ ...p, fullPrice: e.target.value }))
              }
              className="w-full p-2 mb-3 border rounded"
            />

            {/* CATEGORY */}
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="w-full p-2 mb-4 border rounded"
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-red-500 text-white rounded transition-all duration-150 active:scale-95 hover:scale-105"
            >
              {loading ? "Adding..." : "Add Food"}
            </button>
          </form>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}