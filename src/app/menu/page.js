"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Menu() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      const querySnapshot = await getDocs(collection(db, "foods"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFoods(data);
    };

    fetchFoods();
  }, []);

  return (
    <div className="min-h-screen bg-[rgba(251,244,236,1)] pt-24 p-6">

      <h1 className="text-3xl font-bold text-center text-[rgba(178,60,47,1)] mb-8">
        Menu 🍽️
      </h1>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {foods.map(food => (
          <div key={food.id} className="bg-white rounded-xl shadow p-4">

            <img
              src={food.image}
              alt={food.name}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h2 className="text-lg font-semibold mt-2">{food.name}</h2>
            <p className="text-[rgba(178,60,47,1)] font-bold">
              ${food.price}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}