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
  const [size, setSize] = useState("full");

  const { addToCart } = useCart();

  const colors = {
    primary: "rgba(178, 60, 47, 1)",
    background: "rgba(251, 244, 236, 1)",
    text: "rgba(69, 50, 26, 1)",
  };

  // Manual categories
  const categories = ["All", "pizza", "burger", "drinks", "momo", "snacks"];

  useEffect(() => {
    const fetchFoods = async () => {
      const querySnapshot = await getDocs(collection(db, "foods"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFoods(data);
      setFilteredFoods(data);
    };

    fetchFoods();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = foods;

    if (category !== "All") {
      result = result.filter(
        (food) => food.category === category
      );
    }

    if (search) {
      result = result.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredFoods(result);
  }, [search, category, foods]);

  return (
    <div
      className="min-h-screen pt-24 p-6"
      style={{ backgroundColor: colors.background }}
    >
      {/* Title */}
      <h1
        className="text-3xl font-bold text-center mb-6"
        style={{ color: colors.primary }}
      >
        Menu 🍽️
      </h1>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 border rounded-lg shadow-sm focus:outline-none"
          style={{ borderColor: colors.primary }}
        />
      </div>

      {/* Categories */}
      <div className="flex justify-center flex-wrap gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="px-4 py-2 rounded-full border transition"
            style={{
              backgroundColor:
                category === cat ? colors.primary : "white",
              color:
                category === cat ? "white" : colors.text,
              borderColor: colors.primary,
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Size Toggle */}
      <div className="flex justify-center gap-3 mb-8">
        {["half", "full"].map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className="px-4 py-2 rounded-full border"
            style={{
              backgroundColor:
                size === s ? colors.primary : "white",
              color:
                size === s ? "white" : colors.text,
              borderColor: colors.primary,
            }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {filteredFoods.length === 0 ? (
          <p
            className="text-center col-span-3"
            style={{ color: colors.text }}
          >
            No food found
          </p>
        ) : (
          filteredFoods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-xl shadow p-4"
              style={{ border: `1px solid ${colors.primary}20` }}
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-40 object-cover rounded-lg"
              />

              <h2
                className="text-lg font-semibold mt-2"
                style={{ color: colors.text }}
              >
                {food.name}
              </h2>

              <p
                className="text-sm capitalize"
                style={{ color: colors.text }}
              >
                {food.category}
              </p>

              <p
                className="font-bold"
                style={{ color: colors.primary }}
              >
                $
                {size === "half"
                  ? food.halfPrice
                  : food.fullPrice}
              </p>

              <button
                onClick={() =>
                  addToCart({
                    ...food,
                    selectedSize: size,
                    price:
                      size === "half"
                        ? food.halfPrice
                        : food.fullPrice,
                  })
                }
                className="mt-3 w-full py-2 rounded-lg text-white"
                style={{ backgroundColor: colors.primary }}
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