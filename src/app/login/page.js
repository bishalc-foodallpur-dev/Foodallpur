"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Email Login
  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      alert("Logged in successfully!");
      router.push("/"); // redirect to home
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      alert("Google login successful!");
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgba(251,244,236,1)] px-4">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-5">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-[rgba(178,60,47,1)] flex items-center justify-center gap-2">
          <LogIn size={20} /> Login
        </h1>

        {/* Email */}
        <div>
          <label className="text-sm flex items-center gap-2 text-[rgba(69,50,26,1)]">
            <Mail size={16} /> Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(178,60,47,1)]"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm flex items-center gap-2 text-[rgba(69,50,26,1)]">
            <Lock size={16} /> Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(178,60,47,1)]"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[rgba(178,60,47,1)] text-white py-3 rounded-lg hover:scale-105 transition flex items-center justify-center gap-2"
        >
          <LogIn size={18} />
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-[rgba(178,60,47,1)] text-[rgba(178,60,47,1)] py-3 rounded-lg hover:bg-[rgba(178,60,47,1)] hover:text-white transition"
        >
          Continue with Google
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-[rgba(69,50,26,1)]">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-[rgba(178,60,47,1)] font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}