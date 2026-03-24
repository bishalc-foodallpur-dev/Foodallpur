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

  // ================= EMAIL LOGIN =================
  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      alert("Logged in successfully!");
      router.push("/");
    } catch (err) {
      console.error(err);

      let message = "Login failed";

      if (err.code === "auth/user-not-found") {
        message = "User not found";
      } else if (err.code === "auth/wrong-password") {
        message = "Incorrect password";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email";
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      alert("Google login successful!");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= ENTER KEY SUPPORT =================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[rgba(251,244,236,1)]">
      <div
        className="p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-5 border"
        style={{
          backgroundColor: "rgba(69,50,26,1)",
          borderColor: "rgba(251,244,236,0.2)",
        }}
      >
        {/* TITLE */}
        <h1
          className="text-2xl font-bold text-center flex items-center justify-center gap-2"
          style={{ color: "rgba(251,244,236,1)" }}
        >
          <LogIn size={20} />
          Login
        </h1>

        {/* EMAIL */}
        <div>
          <label
            className="text-sm flex items-center gap-2 mb-1"
            style={{ color: "rgba(251,244,236,0.8)" }}
          >
            <Mail size={16} /> Email
          </label>

          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-3 rounded-lg outline-none transition focus:ring-2"
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(251,244,236,0.4)",
              color: "rgba(251,244,236,1)",
            }}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label
            className="text-sm flex items-center gap-2 mb-1"
            style={{ color: "rgba(251,244,236,0.8)" }}
          >
            <Lock size={16} /> Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-3 rounded-lg outline-none transition focus:ring-2"
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(251,244,236,0.4)",
              color: "rgba(251,244,236,1)",
            }}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition hover:brightness-110 disabled:opacity-50"
          style={{
            backgroundColor: "rgba(178,60,47,1)",
            color: "rgba(251,244,236,1)",
          }}
        >
          <LogIn size={18} />
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 rounded-lg border font-medium transition hover:scale-[1.02] disabled:opacity-50"
          style={{
            borderColor: "rgba(251,244,236,0.6)",
            color: "rgba(251,244,236,1)",
          }}
        >
          Continue with Google
        </button>

        {/* REGISTER LINK */}
        <p
          className="text-center text-sm"
          style={{ color: "rgba(251,244,236,0.8)" }}
        >
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold hover:underline"
            style={{ color: "rgba(178,60,47,1)" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}