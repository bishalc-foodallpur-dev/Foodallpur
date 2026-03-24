"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState({});
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const categoryFromHome = searchParams.get("category");

  const colors = {
    primary: "rgba(178, 60, 47, 1)",
    bg: "rgba(251, 244, 236, 1)",
    dark: "rgba(69, 50, 26, 1)",
    textLight: "rgba(251,244,236,1)",
    cardBorder: "rgba(69, 50, 26, 0.15)",
  };

  // ✅ Fetch foods safely
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "foods"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFoods(data || []);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ✅ Auto category from homepage
  useEffect(() => {
    if (categoryFromHome) {
      setSelectedCategory(categoryFromHome);
    }
  }, [categoryFromHome]);

  // ✅ Safe categories
  const categories = [
    "all",
    ...new Set((foods || []).map((f) => f?.category).filter(Boolean)),
  ];

  const handleTypeChange = (foodId, type) => {
    setSelectedType((prev) => ({ ...prev, [foodId]: type }));
  };

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

  const filteredFoods =
    selectedCategory === "all"
      ? foods
      : foods.filter((f) => f.category === selectedCategory);

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: colors.bg }}
    >
      {/* CATEGORY FILTER */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-3 w-max mx-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-full text-sm capitalize whitespace-nowrap"
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
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <p className="text-center" style={{ color: colors.dark }}>
          Loading foods...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods?.map((food) => {
            const type = selectedType[food.id] || "full";
            const qty = quantities[food.id] || 1;

            return (
              <div
                key={food.id}
                className="p-4 rounded-xl shadow-md"
                style={{
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.cardBorder}`,
                }}
              >
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                <h2
                  className="font-bold text-lg"
                  style={{ color: colors.dark }}
                >
                  {food.name}
                </h2>

                <p
                  className="text-sm mb-2"
                  style={{ color: colors.dark }}
                >
                  {food.category}
                </p>

                <div className="text-sm mb-3">
                  <p>Full: Rs. {food.fullPrice}</p>
                  <p>Half: Rs. {food.halfPrice}</p>
                </div>

                {/* TYPE */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => handleTypeChange(food.id, "half")}
                    style={{
                      backgroundColor:
                        type === "half"
                          ? colors.primary
                          : colors.dark,
                      color: colors.textLight,
                    }}
                    className="px-3 py-1 rounded"
                  >
                    Half
                  </button>

                  <button
                    onClick={() => handleTypeChange(food.id, "full")}
                    style={{
                      backgroundColor:
                        type === "full"
                          ? colors.primary
                          : colors.dark,
                      color: colors.textLight,
                    }}
                    className="px-3 py-1 rounded"
                  >
                    Full
                  </button>
                </div>

                {/* QTY */}
                <div className="flex justify-center items-center gap-3 mb-3">
                  <button
                    onClick={() => decreaseQty(food.id)}
                    className="px-3 py-1 rounded text-white"
                    style={{ backgroundColor: colors.dark }}
                  >
                    -
                  </button>

                  <span style={{ color: colors.dark }}>{qty}</span>

                  <button
                    onClick={() => increaseQty(food.id)}
                    className="px-3 py-1 rounded text-white"
                    style={{ backgroundColor: colors.dark }}
                  >
                    +
                  </button>
                </div>

                {/* ADD */}
                <button
                  onClick={() => handleAddToCart(food)}
                  className="w-full py-2 rounded-lg"
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
      )}
    </div>
  );
}