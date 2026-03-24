"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ManageFood() {
  const [foods, setFoods] = useState([]);

  const colors = {
    primary: "rgba(178, 60, 47, 1)",
    text: "rgba(69, 50, 26, 1)",
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

        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: colors.primary }}
        >
          Manage Foods
        </h1>

        <div className="grid md:grid-cols-2 gap-4">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white p-4 shadow rounded border"
              style={{ borderColor: colors.primary + "20" }}
            >
              <h2
                className="font-semibold text-lg"
                style={{ color: colors.text }}
              >
                {food.name}
              </h2>

              <p className="text-sm capitalize">
                Category: {food.category}
              </p>

              <p>
                Half:{" "}
                <span style={{ color: colors.primary }}>
                  Rs {food.halfPrice}
                </span>
              </p>

              <p>
                Full:{" "}
                <span style={{ color: colors.primary }}>
                  Rs {food.fullPrice}
                </span>
              </p>

              <div className="flex gap-2 mt-3">

                <button
                  onClick={() => editFood(food)}
                  className="px-3 py-1 rounded text-white"
                  style={{ backgroundColor: "rgba(0, 123, 255, 1)" }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteFood(food.id)}
                  className="px-3 py-1 rounded text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  Delete
                </button>

              </div>

            </div>
          ))}
        </div>

      </AdminLayout>
    </ProtectedRoute>
  );
}