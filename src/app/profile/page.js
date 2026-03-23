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

  // 🔥 Load profile
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

  // 🔥 Cloudinary upload
  const uploadToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "foodallpur"); // your preset

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dawgv2iso/image/upload",
      formData
    );

    return res.data.secure_url;
  };

  // 🔥 Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔥 Save profile
  const handleSave = async () => {
    try {
      setSaving(true);

      let imageUrl = profile.photoURL;

      // upload new image if selected
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
      <main className="min-h-screen bg-[rgba(251,244,236,1)] pt-24 px-6 flex justify-center">

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 space-y-6">

          <h1 className="text-2xl font-bold text-[rgba(178,60,47,1)] text-center">
            My Profile 👤
          </h1>

          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-3">
            <img
              src={
                preview ||
                "https://via.placeholder.com/100"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />

            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="font-semibold">{user?.email}</p>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              value={profile.name || ""}
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
              value={profile.phone || ""}
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
              value={profile.address || ""}
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
              disabled={saving}
              className="bg-[rgba(178,60,47,1)] text-white px-6 py-2 rounded-lg"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

            <button
              onClick={handleLogout}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg"
            >
              Logout
            </button>

          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}