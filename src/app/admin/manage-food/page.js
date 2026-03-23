"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ManageFood() {
  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "" });
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ✅ Fetch foods
  const fetchFoods = async () => {
    const snapshot = await getDocs(collection(db, "foods"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setFoods(data);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // ✅ Cloudinary upload
  const uploadToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", newImage);
    formData.append("upload_preset", "foodallpur");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dawgv2iso/image/upload",
      formData
    );

    return res.data.secure_url;
  };

  // ✅ Delete food
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this food?")) return;

    try {
      await deleteDoc(doc(db, "foods", id));
      alert("Deleted successfully");
      fetchFoods();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ✅ Start editing
  const startEdit = (food) => {
    setEditingId(food.id);
    setForm({ name: food.name, price: food.price });
    setPreview(food.image);
  };

  // ✅ Handle update
  const handleUpdate = async () => {
    try {
      let imageUrl = preview;

      // If new image selected
      if (newImage) {
        imageUrl = await uploadToCloudinary();
      }

      await updateDoc(doc(db, "foods", editingId), {
        name: form.name,
        price: Number(form.price),
        image: imageUrl,
      });

      alert("Updated successfully");

      setEditingId(null);
      setNewImage(null);
      setPreview(null);

      fetchFoods();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen p-6 pt-24 bg-[rgba(251,244,236,1)]">

        <h1 className="text-2xl font-bold text-center mb-8 text-[rgba(178,60,47,1)]">
          Manage Foods 🛠️
        </h1>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {foods.map(food => (
            <div key={food.id} className="bg-white p-4 rounded-xl shadow">

              <img
                src={food.image}
                className="w-full h-40 object-cover rounded-lg"
              />

              {editingId === food.id ? (
                <>
                  <input
                    className="w-full border p-2 mt-2"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />

                  <input
                    className="w-full border p-2 mt-2"
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />

                  <input
                    type="file"
                    className="mt-2"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setNewImage(file);
                      setPreview(URL.createObjectURL(file));
                    }}
                  />

                  <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white px-4 py-2 mt-2 ml-2 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2 className="font-semibold mt-2">{food.name}</h2>
                  <p className="text-[rgba(178,60,47,1)] font-bold">
                    ${food.price}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => startEdit(food)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(food.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}

            </div>
          ))}

        </div>
      </div>
    </ProtectedRoute>
  );
}