"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { uploadImage } from "@/lib/cloudinary";

export default function AddFood() {
  const [name, setName] = useState("");
  const [fullPrice, setFullPrice] = useState("");
  const [halfPrice, setHalfPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !fullPrice || !halfPrice || !category || !image) {
      alert("❌ Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage(image);

      if (!imageUrl) {
        alert("❌ Image upload failed");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "foods"), {
        name: name.trim(),
        fullPrice: Number(fullPrice),
        halfPrice: Number(halfPrice),
        category: category.toLowerCase().trim(),
        image: imageUrl,
        createdAt: new Date(),
      });

      alert("✅ Food added successfully!");

      setName("");
      setFullPrice("");
      setHalfPrice("");
      setCategory("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      alert("❌ Error adding food");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[rgba(251,244,236,1)]">

      {/* CARD */}
      <div
        className="w-full max-w-xl p-6 rounded-xl shadow-md hover:shadow-xl transition border"
        style={{
          backgroundColor: "rgba(69,50,26,1)",
          borderColor: "rgba(251,244,236,0.2)",
        }}
      >

        {/* TITLE */}
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: "rgba(251,244,236,1)" }}
        >
          Add Food 🍔
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <input
            type="text"
            placeholder="Food Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded outline-none transition focus:ring-2"
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(251,244,236,0.4)",
              color: "rgba(251,244,236,1)",
            }}
          />

          {/* FULL PRICE */}
          <input
            type="number"
            placeholder="Full Price (Rs.)"
            value={fullPrice}
            onChange={(e) => setFullPrice(e.target.value)}
            className="w-full p-3 rounded outline-none transition focus:ring-2"
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(251,244,236,0.4)",
              color: "rgba(251,244,236,1)",
            }}
          />

          {/* HALF PRICE */}
          <input
            type="number"
            placeholder="Half Price (Rs.)"
            value={halfPrice}
            onChange={(e) => setHalfPrice(e.target.value)}
            className="w-full p-3 rounded outline-none transition focus:ring-2"
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(251,244,236,0.4)",
              color: "rgba(251,244,236,1)",
            }}
          />

          {/* CATEGORY */}
          <input
            type="text"
            placeholder="Category (e.g. pizza, burger)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded outline-none transition focus:ring-2"
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(251,244,236,0.4)",
              color: "rgba(251,244,236,1)",
            }}
          />

          {/* IMAGE */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            style={{ color: "rgba(251,244,236,1)" }}
          />

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border"
              style={{ borderColor: "rgba(251,244,236,0.3)" }}
            />
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold transition hover:brightness-110 disabled:opacity-50"
            style={{
              backgroundColor: "rgba(178,60,47,1)",
              color: "rgba(251,244,236,1)",
            }}
          >
            {loading ? "Uploading..." : "Add Food"}
          </button>

        </form>
      </div>
    </div>
  );
}