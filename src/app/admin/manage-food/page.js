"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ManageFood() {
  const [foods, setFoods] = useState([]);
  const [edit, setEdit] = useState(null);

  const colors = {
    primary: "rgba(178,60,47,1)",
    bg: "rgba(251,244,236,1)",
    card: "rgba(69,50,26,1)",
  };

  // ================= REALTIME FETCH =================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "foods"), (snap) => {
      setFoods(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (confirm("Delete this food?")) {
      await deleteDoc(doc(db, "foods", id));
    }
  };

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

  // ================= UPDATE =================
  const handleUpdate = async () => {
    let imageUrl = edit.image;

    if (edit.newImageFile) {
      imageUrl = await uploadImage(edit.newImageFile);
    }

    await updateDoc(doc(db, "foods", edit.id), {
      name: edit.name,
      fullPrice: Number(edit.fullPrice),
      halfPrice: edit.halfPrice ? Number(edit.halfPrice) : null, // ✅ optional
      category: edit.category,
      image: imageUrl,
    });

    setEdit(null);
  };

  // ================= UI =================
  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <div
          className="min-h-screen p-6"
          style={{ backgroundColor: colors.bg }}
        >
          <h1
            className="text-2xl font-bold mb-6"
            style={{ color: colors.primary }}
          >
            Manage Foods 🍔
          </h1>

          {/* FOOD LIST */}
          <div className="grid md:grid-cols-2 gap-6">
            {foods.map((food) => (
              <div
                key={food.id}
                className="p-5 rounded-xl shadow"
                style={{ backgroundColor: colors.card }}
              >
                {food.image && (
                  <img
                    src={food.image}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}

                <h2 className="text-white font-semibold text-lg">
                  {food.name}
                </h2>

                <p className="text-gray-300">
                  Category: {food.category || "N/A"}
                </p>

                <p className="text-white">
                  Half:{" "}
                  {food.halfPrice
                    ? `Rs ${food.halfPrice}`
                    : "N/A"}
                </p>

                <p className="text-white">
                  Full: Rs {food.fullPrice}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() =>
                      setEdit({
                        ...food,
                        newImageFile: null,
                        preview: null,
                      })
                    }
                    className="px-3 py-1 rounded text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(food.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= EDIT MODAL ================= */}
          {edit && (
            <div
              className="fixed inset-0 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(251,244,236,0.9)",
              }}
            >
              <div
                className="p-6 rounded-xl w-full max-w-md border shadow-lg"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.primary,
                }}
              >
                <h2
                  className="text-xl font-semibold mb-4 text-center"
                  style={{ color: colors.bg }}
                >
                  Edit Food
                </h2>

                {/* IMAGE */}
                <div className="mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      setEdit({
                        ...edit,
                        newImageFile: file,
                        preview: URL.createObjectURL(file),
                      });
                    }}
                    className="w-full p-2 rounded"
                    style={{
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.primary}`,
                    }}
                  />

                  <img
                    src={edit.preview || edit.image}
                    className="mt-3 w-full h-40 object-cover rounded"
                  />
                </div>

                {/* NAME */}
                <input
                  className="w-full p-2 mb-3 rounded"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.card,
                    border: `1px solid ${colors.primary}`,
                  }}
                  value={edit.name}
                  onChange={(e) =>
                    setEdit({ ...edit, name: e.target.value })
                  }
                />

                {/* HALF PRICE (OPTIONAL) */}
                <input
                  type="number"
                  placeholder="Half Price (optional)"
                  className="w-full p-2 mb-3 rounded"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.card,
                    border: `1px solid ${colors.primary}`,
                  }}
                  value={edit.halfPrice || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, halfPrice: e.target.value })
                  }
                />

                {/* FULL PRICE */}
                <input
                  type="number"
                  className="w-full p-2 mb-3 rounded"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.card,
                    border: `1px solid ${colors.primary}`,
                  }}
                  value={edit.fullPrice}
                  onChange={(e) =>
                    setEdit({ ...edit, fullPrice: e.target.value })
                  }
                />

                {/* CATEGORY */}
                <input
                  className="w-full p-2 mb-4 rounded"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.card,
                    border: `1px solid ${colors.primary}`,
                  }}
                  value={edit.category || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, category: e.target.value })
                  }
                />

                {/* BUTTONS */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEdit(null)}
                    className="px-4 py-2 rounded"
                    style={{ backgroundColor: "#888", color: "white" }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 rounded"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.bg,
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}