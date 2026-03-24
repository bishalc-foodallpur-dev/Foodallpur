"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    photoURL: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data());
        setPreview(docSnap.data().photoURL);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  // Cloudinary upload
  const uploadToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "foodallpur");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dawgv2iso/image/upload",
      formData
    );

    return res.data.secure_url;
  };

  // Image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Save profile
  const handleSave = async () => {
    try {
      setSaving(true);

      let imageUrl = profile.photoURL;

      if (image) {
        imageUrl = await uploadToCloudinary();
      }

      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        photoURL: imageUrl,
        email: user.email,
      });

      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <ProtectedRoute>
      <main className="min-h-screen flex justify-center items-center px-6 bg-[rgba(251,244,236,1)]">

        <div
          className="w-full max-w-2xl p-6 rounded-xl shadow-lg border space-y-6"
          style={{
            backgroundColor: "rgba(69,50,26,1)",
            borderColor: "rgba(251,244,236,0.2)",
          }}
        >

          {/* TITLE */}
          <h1
            className="text-2xl font-bold text-center"
            style={{ color: "rgba(251,244,236,1)" }}
          >
            My Profile 👤
          </h1>

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center space-y-3">
            <img
              src={preview || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
              style={{ borderColor: "rgba(251,244,236,0.4)" }}
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ color: "rgba(251,244,236,1)" }}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label
              className="text-sm"
              style={{ color: "rgba(251,244,236,0.8)" }}
            >
              Email
            </label>
            <p style={{ color: "rgba(251,244,236,1)" }} className="font-semibold">
              {user?.email}
            </p>
          </div>

          {/* NAME */}
          <div>
            <label
              className="text-sm"
              style={{ color: "rgba(251,244,236,0.8)" }}
            >
              Name
            </label>
            <input
              type="text"
              value={profile.name || ""}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="w-full p-3 rounded outline-none"
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(251,244,236,0.4)",
                color: "rgba(251,244,236,1)",
              }}
              placeholder="Enter your name"
            />
          </div>

          {/* PHONE */}
          <div>
            <label
              className="text-sm"
              style={{ color: "rgba(251,244,236,0.8)" }}
            >
              Phone Number
            </label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full p-3 rounded outline-none"
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(251,244,236,0.4)",
                color: "rgba(251,244,236,1)",
              }}
              placeholder="Enter your phone"
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label
              className="text-sm"
              style={{ color: "rgba(251,244,236,0.8)" }}
            >
              Address
            </label>
            <textarea
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              className="w-full p-3 rounded outline-none"
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(251,244,236,0.4)",
                color: "rgba(251,244,236,1)",
              }}
              placeholder="Enter your address"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between gap-3">

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 rounded-lg font-semibold transition hover:brightness-110 disabled:opacity-50"
              style={{
                backgroundColor: "rgba(178,60,47,1)",
                color: "rgba(251,244,236,1)",
              }}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 py-3 rounded-lg font-semibold border transition hover:scale-105"
              style={{
                borderColor: "rgba(251,244,236,0.6)",
                color: "rgba(251,244,236,1)",
              }}
            >
              Logout
            </button>

          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}