"use client";

import Image from "next/image";
import { ShoppingCart, Utensils } from "lucide-react";

export default function Menu() {
  const foods = [
    {
      id: 1,
      name: "Burger",
      price: 5,
      image: "/foods/burger.jpg",
    },
    {
      id: 2,
      name: "Pizza",
      price: 8,
      image: "/foods/pizza.jpg",
    },
    {
      id: 3,
      name: "Fries",
      price: 3,
      image: "/foods/fries.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-[rgba(251,244,236,1)] pt-24 px-6">

      {/* Title */}
      <h1 className="text-3xl font-bold text-[rgba(178,60,47,1)] mb-10 text-center flex items-center justify-center gap-2">
        <Utensils size={24} /> Our Menu
      </h1>

      {/* Food Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {foods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Image */}
            <div className="relative w-full h-48">
              <Image
                src={food.image}
                alt={food.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-5">

              <h2 className="text-xl font-semibold text-[rgba(69,50,26,1)]">
                {food.name}
              </h2>

              <p className="text-[rgba(178,60,47,1)] font-bold mt-2 text-lg">
                ${food.price}
              </p>

              <button className="mt-5 w-full flex items-center justify-center gap-2 bg-[rgba(178,60,47,1)] text-white py-2.5 rounded-lg hover:scale-105 transition">
                <ShoppingCart size={18} />
                Add to Cart
              </button>

            </div>
          </div>
        ))}

      </div>
    </main>
  );
}