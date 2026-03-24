"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useCart } from "@/context/CartContext";

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [selectedType, setSelectedType] = useState({});
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { addToCart } = useCart();

  const colors = {
    primary: "rgba(178, 60, 47, 1)",
    bg: "rgba(251, 244, 236, 1)",
    cardBorder: "rgba(69, 50, 26, 0.2)",
    dark: "rgba(69, 50, 26, 1)",
    textLight: "rgba(251,244,236,1)",
  };

  // Fetch foods
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

  // Categories
  const categories = [
    "all",
    ...new Set(foods.map((f) => f.category).filter(Boolean)),
  ];

  // Set type
  const handleTypeChange = (foodId, type) => {
    setSelectedType((prev) => ({
      ...prev,
      [foodId]: type,
    }));
  };

  // Quantity controls
  const increaseQty = (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 1) + 1,
    }));
  };

  const decreaseQty = (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: Math.max(1, (prev[foodId] || 1) - 1),
    }));
  };

  // Add to cart
  const handleAddToCart = (food) => {
    const type = selectedType[food.id] || "full";
    const quantity = quantities[food.id] || 1;

    const price =
      type === "half"
        ? food.halfPrice || 0
        : food.fullPrice || 0;

    addToCart({
      id: food.id,
      name: food.name,
      image: food.image,
      price,
      type,
      quantity,
    });
  };

  // Filter foods
  const filteredFoods =
    selectedCategory === "all"
      ? foods
      : foods.filter((f) => f.category === selectedCategory);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.bg }}>

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
                  ? colors.primary
                  : colors.dark,
                color: colors.textLight,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* FOOD GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredFoods.map((food) => {
          const type = selectedType[food.id] || "full";
          const qty = quantities[food.id] || 1;

          return (
            <div
              key={food.id}
              className="p-4 rounded-xl shadow-md hover:shadow-xl transition hover:scale-[1.02]"
              style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.cardBorder}`,
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
                style={{ color: colors.dark }}
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
                <p style={{ color: colors.dark }}>
                  Full: Rs. {food.fullPrice}
                </p>
                <p style={{ color: colors.dark }}>
                  Half: Rs. {food.halfPrice}
                </p>
              </div>

              {/* HALF / FULL TOGGLE */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => handleTypeChange(food.id, "half")}
                  className="px-3 py-1 rounded text-sm transition"
                  style={{
                    backgroundColor:
                      type === "half" ? colors.primary : colors.dark,
                    color: colors.textLight,
                  }}
                >
                  Half
                </button>

                <button
                  onClick={() => handleTypeChange(food.id, "full")}
                  className="px-3 py-1 rounded text-sm transition"
                  style={{
                    backgroundColor:
                      type === "full" ? colors.primary : colors.dark,
                    color: colors.textLight,
                  }}
                >
                  Full
                </button>
              </div>

              {/* QUANTITY SELECTOR */}
              <div className="flex items-center justify-center gap-3 mb-3">
                <button
                  onClick={() => decreaseQty(food.id)}
                  className="px-3 py-1 rounded text-white"
                  style={{ backgroundColor: colors.dark }}
                >
                  -
                </button>

                <span style={{ color: colors.dark, fontWeight: "bold" }}>
                  {qty}
                </span>

                <button
                  onClick={() => increaseQty(food.id)}
                  className="px-3 py-1 rounded text-white"
                  style={{ backgroundColor: colors.dark }}
                >
                  +
                </button>
              </div>

              {/* ADD TO CART */}
              <button
                onClick={() => handleAddToCart(food)}
                className="w-full py-2 rounded-lg font-semibold transition hover:brightness-110"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.textLight,
                }}
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}