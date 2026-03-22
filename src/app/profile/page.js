"use client";

import { User, Mail, Phone, Save, LogOut } from "lucide-react";

export default function Profile() {
  return (
    <main className="min-h-screen bg-[rgba(251,244,236,1)] pt-24 px-6 flex justify-center">

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8">

        {/* Header */}
        <h1 className="text-2xl font-bold text-[rgba(178,60,47,1)] mb-8 text-center flex items-center justify-center gap-2">
          <User size={22} /> My Profile
        </h1>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[rgba(178,60,47,1)] flex items-center justify-center text-white text-2xl font-bold">
            U
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-5 text-[rgba(69,50,26,1)]">

          {/* Name */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <User size={16} /> Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(178,60,47,1)]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              placeholder="Your email"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(178,60,47,1)]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone size={16} /> Phone
            </label>
            <input
              type="text"
              placeholder="Your phone number"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(178,60,47,1)]"
            />
          </div>

        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between">

          <button className="flex items-center justify-center gap-2 bg-[rgba(178,60,47,1)] text-white px-5 py-2.5 rounded-lg hover:scale-105 transition w-full md:w-auto">
            <Save size={18} />
            Save Changes
          </button>

          <button className="flex items-center justify-center gap-2 border border-[rgba(178,60,47,1)] text-[rgba(178,60,47,1)] px-5 py-2.5 rounded-lg hover:bg-[rgba(178,60,47,1)] hover:text-white transition w-full md:w-auto">
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </div>

    </main>
  );
}