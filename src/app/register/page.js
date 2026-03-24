"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Lock } from "lucide-react";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      await createUserWithEmailAndPassword(auth, email, password);

      alert("User registered!");
      router.push("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[rgba(251,244,236,1)]">

      <div
        className="w-full max-w-sm p-8 rounded-2xl shadow-lg border space-y-5"
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
          <UserPlus size={20} />
          Register
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
            className="w-full p-3 rounded-lg outline-none transition"
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(251,244,236,0.4)",
              color: "rgba(251,244,236,1)",
            }}
            onChange={(e) => setEmail(e.target.value)}
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
            className="w-full p-3 rounded-lg outline-none transition"
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(251,244,236,0.4)",
              color: "rgba(251,244,236,1)",
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* REGISTER BUTTON */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold transition hover:brightness-110 disabled:opacity-50"
          style={{
            backgroundColor: "rgba(178,60,47,1)",
            color: "rgba(251,244,236,1)",
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* LOGIN LINK */}
        <p
          className="text-center text-sm"
          style={{ color: "rgba(251,244,236,0.8)" }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold hover:underline"
            style={{ color: "rgba(178,60,47,1)" }}
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}