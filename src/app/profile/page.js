"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔥 Load profile from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  // 🔥 Save profile
  const handleSave = async () => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        email: user.email,
      });

      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[rgba(251,244,236,1)] pt-24 px-6 flex justify-center">

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 space-y-6">

          <h1 className="text-2xl font-bold text-[rgba(178,60,47,1)] text-center">
            My Profile 👤
          </h1>

          {/* Email (Gmail) */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="font-semibold">{user?.email}</p>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter your phone"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm text-gray-600">Address</label>
            <textarea
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter your address"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">

            <button
              onClick={handleSave}
              className="bg-[rgba(178,60,47,1)] text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Save Profile
            </button>

            <button
              onClick={handleLogout}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Logout
            </button>

          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}