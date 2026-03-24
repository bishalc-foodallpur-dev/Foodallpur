"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ManageFood() {
  const [foods, setFoods] = useState([]);

  const colors = {
    primary: "rgba(178, 60, 47, 1)",
    background: "rgba(251, 244, 236, 1)",
    card: "rgba(69, 50, 26, 1)",
    text: "rgba(251, 244, 236, 1)",
    secondaryText: "rgba(251, 244, 236, 0.8)",
  };

  const fetchFoods = async () => {
    const snapshot = await getDocs(collection(db, "foods"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFoods(list);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const deleteFood = async (id) => {
    await deleteDoc(doc(db, "foods", id));
    fetchFoods();
  };

  const editFood = async (food) => {
    const name = prompt("Enter new name", food.name);
    const halfPrice = prompt("Enter new half price", food.halfPrice);
    const fullPrice = prompt("Enter new full price", food.fullPrice);
    const category = prompt("Enter new category", food.category);

    if (!name || !halfPrice || !fullPrice || !category) return;

    await updateDoc(doc(db, "foods", food.id), {
      name,
      halfPrice: Number(halfPrice),
      fullPrice: Number(fullPrice),
      category,
    });

    fetchFoods();
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>

        <div className="min-h-screen p-6 bg-[rgba(251,244,236,1)]">

          {/* TITLE */}
          <h1
            className="text-2xl font-bold mb-6"
            style={{ color: colors.primary }}
          >
            Manage Foods 🍔
          </h1>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">

            {foods.map((food) => (
              <div
                key={food.id}
                className="p-5 rounded-xl shadow-md hover:shadow-xl transition border"
                style={{
                  backgroundColor: colors.card,
                  borderColor: "rgba(251,244,236,0.2)",
                }}
              >

                {/* NAME */}
                <h2
                  className="font-semibold text-lg"
                  style={{ color: colors.text }}
                >
                  {food.name}
                </h2>

                {/* CATEGORY */}
                <p
                  className="text-sm capitalize"
                  style={{ color: colors.secondaryText }}
                >
                  Category: {food.category}
                </p>

                {/* PRICES */}
                <div className="mt-2">
                  <p style={{ color: colors.secondaryText }}>
                    Half:{" "}
                    <span style={{ color: colors.text }}>
                      Rs {food.halfPrice}
                    </span>
                  </p>

                  <p style={{ color: colors.secondaryText }}>
                    Full:{" "}
                    <span style={{ color: colors.text }}>
                      Rs {food.fullPrice}
                    </span>
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() => editFood(food)}
                    className="px-3 py-1 rounded text-sm font-medium transition hover:scale-105"
                    style={{
                      backgroundColor: "rgba(251,244,236,1)",
                      color: "rgba(69,50,26,1)",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteFood(food.id)}
                    className="px-3 py-1 rounded text-sm font-medium transition hover:scale-105"
                    style={{
                      backgroundColor: colors.primary,
                      color: "rgba(251,244,236,1)",
                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        </div>

      </AdminLayout>
    </ProtectedRoute>
  );
}