"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User registered!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgba(251,244,236,1)]">
      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-4">
        <h1 className="text-xl font-bold text-center text-[rgba(178,60,47,1)]">
          Register
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-[rgba(178,60,47,1)] text-white py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}