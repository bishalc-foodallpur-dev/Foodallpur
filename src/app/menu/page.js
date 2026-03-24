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

  const categories = ["all", ...new Set(foods.map((f) => f.category))];

  const handleTypeChange = (foodId, type) => {
    setSelectedType((prev) => ({
      ...prev,
      [foodId]: type,
    }));
  };

  const handleAddToCart = (food) => {
    const type = selectedType[food.id] || "full";

    const price =
      type === "half" ? food.halfPrice : food.fullPrice;

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
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "rgba(251,244,236,1)" }}
    >

      {/* CATEGORY FILTER */}
      <div className="flex gap-3 mb-6 flex-wrap justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="px-4 py-2 rounded font-medium capitalize"
            style={{
              backgroundColor:
                selectedCategory === cat
                  ? "rgba(178,60,47,1)"
                  : "rgba(69,50,26,1)",
              color: "rgba(251,244,236,1)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FOOD GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="p-4 rounded shadow"
            style={{ backgroundColor: "rgba(69, 50, 26, 1)" }}
          >

            <img
              src={food.image}
              className="w-full h-40 object-cover rounded"
            />

            <h2
              className="text-lg font-bold mt-2"
              style={{ color: "rgba(251,244,236,1)" }}
            >
              {food.name}
            </h2>

            <p style={{ color: "rgba(251,244,236,0.8)" }}>
              {food.category}
            </p>

            {/* PRICES */}
            <div className="mt-2 space-y-1">
              <p style={{ color: "rgba(251,244,236,1)" }}>
                Full: Rs. {food.fullPrice}
              </p>
              <p style={{ color: "rgba(251,244,236,1)" }}>
                Half: Rs. {food.halfPrice}
              </p>
            </div>

            {/* TYPE SELECT */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleTypeChange(food.id, "half")}
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor:
                    selectedType[food.id] === "half"
                      ? "rgba(178,60,47,1)"
                      : "rgba(251,244,236,1)",
                  color:
                    selectedType[food.id] === "half"
                      ? "rgba(251,244,236,1)"
                      : "rgba(69,50,26,1)",
                }}
              >
                Half
              </button>

              <button
                onClick={() => handleTypeChange(food.id, "full")}
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor:
                    selectedType[food.id] === "full"
                      ? "rgba(178,60,47,1)"
                      : "rgba(251,244,236,1)",
                  color:
                    selectedType[food.id] === "full"
                      ? "rgba(251,244,236,1)"
                      : "rgba(69,50,26,1)",
                }}
              >
                Full
              </button>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={() => handleAddToCart(food)}
              className="w-full mt-3 py-2 rounded font-semibold"
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