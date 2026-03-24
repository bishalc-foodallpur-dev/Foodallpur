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

  const [categories, setCategories] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [fade, setFade] = useState(true);

  const colors = {
    primary: "rgba(178,60,47,1)",
    bg: "rgba(251,244,236,1)",
    text: "rgba(69,50,26,1)",
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "foods"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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
    <main style={{ backgroundColor: colors.bg }}>

      {/* HERO */}
      <section className="relative h-[70vh] md:h-[90vh] flex items-center justify-center text-center">

        <video
          key={currentVideo}
          src={videos[currentVideo]}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* content */}
        <div className="relative z-10 px-4 max-w-xl text-white">

          <h1 className="text-2xl md:text-5xl font-bold mb-4 leading-tight">
            Delicious Food Delivered Fast
          </h1>

          <p className="text-sm md:text-lg mb-6 opacity-90">
            Fresh meals delivered hot and fast to your doorstep.
          </p>

          <Link
            href="/menu"
            className="bg-[rgba(178,60,47,1)] px-5 py-3 md:px-8 rounded-lg text-white font-medium hover:scale-105 transition inline-block text-sm md:text-base"
          >
            Order Now
          </Link>

        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-14 px-4 text-center">
        <h2 className="text-xl md:text-3xl font-bold mb-10" style={{ color: colors.primary }}>
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">

          <div>
            <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
              Fast Delivery
            </h3>
            <p className="text-sm text-gray-600">
              Quick delivery to your doorstep.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
              Fresh Ingredients
            </h3>
            <p className="text-sm text-gray-600">
              High-quality and freshly prepared food.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
              Affordable Prices
            </h3>
            <p className="text-sm text-gray-600">
              Best value meals at reasonable cost.
            </p>
          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-4 py-16">

        <h2
          className="text-xl md:text-3xl font-bold text-center mb-10"
          style={{ color: colors.primary }}
        >
          Categories 📂
        </h2>

        {categories.length === 0 ? (
          <p className="text-center" style={{ color: colors.text }}>
            No categories found.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">

            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/menu?category=${cat}`}
                className="bg-white rounded-lg shadow p-4 text-center hover:scale-105 transition"
              >
                <div
                  className="text-sm md:text-base font-semibold capitalize"
                  style={{ color: colors.text }}
                >
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