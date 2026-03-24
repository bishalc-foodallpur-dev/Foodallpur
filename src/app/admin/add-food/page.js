"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadImage } from "@/lib/cloudinary";

export default function AddFood() {
  const [form, setForm] = useState({ name: "", fullPrice: "", halfPrice: "", category: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const colors = { primary: "rgba(178,60,47,1)", bg: "rgba(251,244,236,1)", card: "rgba(69,50,26,1)" };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.fullPrice || !form.halfPrice || !form.category || !image) return alert("Fill all fields");
    setLoading(true);
    try {
      const imageUrl = await uploadImage(image);
      await addDoc(collection(db, "foods"), { ...form, fullPrice: Number(form.fullPrice), halfPrice: Number(form.halfPrice), image: imageUrl, createdAt: serverTimestamp() });
      alert("Food Added ✅");
      setForm({ name: "", fullPrice: "", halfPrice: "", category: "" });
      setImage(null);
      setPreview(null);
    } catch (err) { console.error(err); alert("Error adding food"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.bg }}>
      <form onSubmit={handleSubmit} className="w-full max-w-xl p-6 rounded-xl shadow-lg" style={{ backgroundColor: colors.card }}>
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Add Food 🍔</h2>

        <input name="name" placeholder="Food Name" value={form.name} onChange={handleChange} className="w-full p-3 mb-3 rounded"/>
        <input name="fullPrice" type="number" placeholder="Full Price" value={form.fullPrice} onChange={handleChange} className="w-full p-3 mb-3 rounded"/>
        <input name="halfPrice" type="number" placeholder="Half Price" value={form.halfPrice} onChange={handleChange} className="w-full p-3 mb-3 rounded"/>

        <select name="category" value={form.category} onChange={handleChange} className="w-full p-3 mb-3 rounded">
          <option value="">Select Category</option>
          <option value="pizza">Pizza</option>
          <option value="burger">Burger</option>
          <option value="momo">Momo</option>
          <option value="chicken">Chicken</option>
          <option value="drinks">Drinks</option>
        </select>

        <input type="file" accept="image/*" onChange={handleImage}/>
        {preview && <img src={preview} className="w-full h-40 object-cover mt-3 rounded"/>}

        <button type="submit" disabled={loading} className="w-full mt-4 py-3 rounded text-white" style={{ backgroundColor: colors.primary }}>
          {loading ? "Uploading..." : "Add Food"}
        </button>
      </form>
    </div>
  );
}