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

  const editFood = async (id) => {
    const name = prompt("New name");
    const price = prompt("New price");

    if (!name || !price) return;

    await updateDoc(doc(db, "foods", id), {
      name,
      price: Number(price),
    });

    fetchFoods();
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>

        <h1 className="text-2xl font-bold mb-6">Manage Foods</h1>

        <div className="grid md:grid-cols-2 gap-4">
          {foods.map((food) => (
            <div key={food.id} className="bg-white p-4 shadow rounded">

              <h2 className="font-semibold">{food.name}</h2>
              <p>Rs {food.price}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => editFood(food.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteFood(food.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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