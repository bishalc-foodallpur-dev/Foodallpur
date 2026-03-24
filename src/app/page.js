"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Home() {
  const videos = [
    "/videos/food1.mp4",
    "/videos/food2.mp4",
    "/videos/food3.mp4",
    "/videos/food4.mp4",
    "/videos/food5.mp4",
    "/videos/food6.mp4",
    "/videos/food7.mp4",
  ];

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [currentVideo, setCurrentVideo] = useState(0);
  const [fade, setFade] = useState(true);

  // ✅ Fetch foods from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "foods"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFoods(data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(data.map((f) => f.category).filter(Boolean)),
      ];

      setCategories(uniqueCategories);
    });

    return () => unsubscribe();
  }, []);

  const getRandomIndex = useCallback((current) => {
    let next;
    do {
      next = Math.floor(Math.random() * videos.length);
    } while (next === current);
    return next;
  }, [videos.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentVideo((prev) => getRandomIndex(prev));
        setFade(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [getRandomIndex]);

  return (
    <main className="bg-[rgba(251,244,236,1)] pt-20">

      {/* HERO VIDEO */}
      <section className="w-full flex flex-col items-center px-4">

        <div className="relative w-full max-w-5xl h-[45vh] md:h-[55vh] rounded-xl overflow-hidden shadow-lg">

          <video
            key={currentVideo}
            src={videos[currentVideo]}
            autoPlay
            muted
            loop
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="text-center max-w-2xl mt-8">

          <p className="text-[rgba(69,50,26,1)] text-sm md:text-lg mb-6">
            Order fresh meals from FoodAllpur and enjoy hot, tasty food at your doorstep with just a few clicks.
          </p>

          <Link
            href="/menu"
            className="bg-[rgba(178,60,47,1)] text-white px-6 py-3 rounded-lg shadow-md hover:scale-105 transition inline-block"
          >
            Order Now
          </Link>

        </div>
      </section>

      {/* DYNAMIC CATEGORIES FROM MENU */}
      <section className="px-4 md:px-6 py-16">

        <h2 className="text-2xl md:text-3xl font-bold text-[rgba(178,60,47,1)] text-center mb-10">
          Categories 📂
        </h2>

        {categories.length === 0 ? (
          <p className="text-center text-[rgba(69,50,26,1)]">
            No categories found.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">

            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/menu?category=${cat}`}
                className="bg-white rounded-xl shadow-md p-4 text-center hover:scale-105 transition"
              >
                <div className="font-semibold text-[rgba(69,50,26,1)] capitalize">
                  {cat}
                </div>
              </Link>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}