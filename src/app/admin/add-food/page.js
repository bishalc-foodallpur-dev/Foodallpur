"use client";

import { useState } from "react";
import axios from "axios";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AddFood() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async () => {
    const formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // 🔥 replace
    formData.append("cloud_name", "YOUR_CLOUD_NAME"); // 🔥 replace

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      formData
    );

    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !image) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      // 1. Upload image
      const imageUrl = await uploadToCloudinary();

      // 2. Save to Firestore
      await addDoc(collection(db, "foods"), {
        name,
        price: Number(price),
        image: imageUrl,
        createdAt: new Date(),
      });

      alert("Food added successfully!");

      // reset
      setName("");
      setPrice("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Error adding food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen flex items-center justify-center bg-[rgba(251,244,236,1)] p-6 pt-24">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
        >
          <h1 className="text-2xl font-bold text-center text-[rgba(178,60,47,1)]">
            Add Food 🍔
          </h1>

          <input
            type="text"
            placeholder="Food Name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[rgba(178,60,47,1)] text-white py-2 rounded-lg"
          >
            {loading ? "Uploading..." : "Add Food"}
          </button>
        </form>

      </div>
    </ProtectedRoute>
  );
}