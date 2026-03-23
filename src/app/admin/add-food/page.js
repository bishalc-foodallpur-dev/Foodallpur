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
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Upload to Cloudinary
  const uploadToCloudinary = async () => {
    const formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", "foodallpur"); // ✅ your preset name

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dawgv2iso/image/upload",
        formData
      );

      return res.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error.response?.data || error.message);
      throw new Error("Image upload failed");
    }
  };

  // ✅ Handle image selection + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Optional validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Submit handler
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

      // reset form
      setName("");
      setPrice("");
      setImage(null);
      setPreview(null);

    } catch (err) {
      console.error(err.message);
      alert("Upload failed");
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

          {/* Food Name */}
          <input
            type="text"
            placeholder="Food Name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Price */}
          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={handleImageChange}
          />

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg"
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[rgba(178,60,47,1)] text-white py-2 rounded-lg flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Add Food"
            )}
          </button>

        </form>

      </div>
    </ProtectedRoute>
  );
}