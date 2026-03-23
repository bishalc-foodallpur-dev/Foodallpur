"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isAdmin = user?.email === "bishalc.foodallpur@gmail.com";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (adminOnly && !isAdmin) {
        router.push("/");
      }
    }
  }, [user, loading, adminOnly, isAdmin, router]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  if (!user) return null;

  if (adminOnly && !isAdmin) return null;

  return children;
}