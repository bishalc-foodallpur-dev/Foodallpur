"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Page() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(data);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Delete this review?")) {
      await deleteDoc(doc(db, "reviews", id));
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>

          <div className="grid gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold">{rev.name}</h3>

                <p className="text-yellow-500">
                  {"★".repeat(rev.rating || 0)}
                  <span className="text-gray-300">
                    {"★".repeat(5 - (rev.rating || 0))}
                  </span>
                </p>

                <p className="text-sm text-gray-600">{rev.comment}</p>

                <button
                  onClick={() => handleDelete(rev.id)}
                  className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}