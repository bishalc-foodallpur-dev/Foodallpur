"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "@/context/CartContext";

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFoods = async () => {
      const querySnapshot = await getDocs(collection(db, "foods"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFoods(data);
      setFilteredFoods(data);
    };

    fetchFoods();
  }, []);

  // Categories (auto + manual)
  const categories = ["All", "Burger", "Pizza", "Drinks", "Dessert"];

  // Filter logic
  useEffect(() => {
    let result = foods;

    if (category !== "All") {
      result = result.filter(food => food.category === category);
    }

    if (search) {
      result = result.filter(food =>
        food.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredFoods(result);
  }, [search, category, foods]);

  return (
    <div className="min-h-screen bg-[rgba(251,244,236,1)] pt-24 p-6">

      <h1 className="text-3xl font-bold text-center text-[rgba(178,60,47,1)] mb-6">
        Menu 🍽️
      </h1>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgba(178,60,47,1)]"
        />
      </div>

      {/* 📂 Category Filter */}
      <div className="flex justify-center flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full border transition ${
              category === cat
                ? "bg-[rgba(178,60,47,1)] text-white"
                : "bg-white text-[rgba(69,50,26,1)] hover:bg-[rgba(178,60,47,0.1)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🍔 Food Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {filteredFoods.length === 0 ? (
          <p className="text-center col-span-3 text-gray-500">
            No food found
          </p>
        ) : (
          filteredFoods.map(food => (
            <div key={food.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">

              <img
                src={food.image}
                alt={food.name}
                className="w-full h-40 object-cover rounded-lg"
              />

              <h2 className="text-lg font-semibold mt-2">
                {food.name}
              </h2>

              <p className="text-sm text-gray-500">
                {food.category}
              </p>

              <p className="text-[rgba(178,60,47,1)] font-bold">
                ${food.price}
              </p>

              <button
                onClick={() => addToCart(food)}
                className="mt-3 w-full bg-[rgba(178,60,47,1)] text-white py-2 rounded-lg hover:opacity-90"
              >
                Add to Cart 🛒
              </button>

            </div>
          ))
        )}

      </div>
    </div>
  );
}