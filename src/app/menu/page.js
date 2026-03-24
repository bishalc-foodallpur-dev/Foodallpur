"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useCart } from "@/context/CartContext";

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [selectedType, setSelectedType] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { addToCart } = useCart();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "foods"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoods(data);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    "all",
    ...new Set(foods.map((f) => f.category).filter(Boolean)),
  ];

  const handleTypeChange = (foodId, type) => {
    setSelectedType((prev) => ({
      ...prev,
      [foodId]: type,
    }));
  };

  const handleAddToCart = (food) => {
    const type = selectedType[food.id] || "full";
    const price = type === "half" ? food.halfPrice : food.fullPrice;

    addToCart({
      id: food.id,
      name: food.name,
      image: food.image,
      price,
      type,
    });
  };

  const filteredFoods =
    selectedCategory === "all"
      ? foods
      : foods.filter((f) => f.category === selectedCategory);

  return (
    <div className="min-h-screen p-6 bg-[rgba(251,244,236,1)]">

      {/* CATEGORY FILTER */}
      <div className="flex gap-3 mb-8 flex-wrap justify-center">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-2 rounded-full font-medium capitalize transition hover:scale-105"
              style={{
                backgroundColor: isActive
                  ? "rgba(178,60,47,1)"
                  : "rgba(69,50,26,1)",
                color: "rgba(251,244,236,1)",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* FOOD GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="p-4 rounded-xl shadow-md hover:shadow-xl transition hover:scale-[1.02]"
            style={{
              backgroundColor: "rgba(251,244,236,1)",
              border: "1px solid rgba(69,50,26,0.2)",
            }}
          >

            {/* IMAGE */}
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />

            {/* NAME */}
            <h2
              className="text-lg font-bold"
              style={{ color: "rgba(69,50,26,1)" }}
            >
              {food.name}
            </h2>

            {/* CATEGORY */}
            <p
              className="text-sm mb-2"
              style={{ color: "rgba(69,50,26,0.7)" }}
            >
              {food.category}
            </p>

            {/* PRICES */}
            <div className="mb-3 text-sm space-y-1">
              <p style={{ color: "rgba(69,50,26,1)" }}>
                Full: Rs. {food.fullPrice}
              </p>
              <p style={{ color: "rgba(69,50,26,1)" }}>
                Half: Rs. {food.halfPrice}
              </p>
            </div>

            {/* TYPE SELECT */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => handleTypeChange(food.id, "half")}
                className="px-3 py-1 rounded text-sm transition"
                style={{
                  backgroundColor:
                    selectedType[food.id] === "half"
                      ? "rgba(178,60,47,1)"
                      : "rgba(69,50,26,1)",
                  color: "rgba(251,244,236,1)",
                }}
              >
                Half
              </button>

              <button
                onClick={() => handleTypeChange(food.id, "full")}
                className="px-3 py-1 rounded text-sm transition"
                style={{
                  backgroundColor:
                    selectedType[food.id] === "full"
                      ? "rgba(178,60,47,1)"
                      : "rgba(69,50,26,1)",
                  color: "rgba(251,244,236,1)",
                }}
              >
                Full
              </button>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={() => handleAddToCart(food)}
              className="w-full py-2 rounded-lg font-semibold transition hover:brightness-110"
              style={{
                backgroundColor: "rgba(178,60,47,1)",
                color: "rgba(251,244,236,1)",
              }}
            >
              Add to Cart
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}