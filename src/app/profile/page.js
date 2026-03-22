"use client";

export default function Profile() {
  return (
    <main className="min-h-screen bg-[rgba(251,244,236,1)] pt-24 px-6 flex justify-center">

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">

        {/* Header */}
        <h1 className="text-2xl font-bold text-[rgba(178,60,47,1)] mb-6 text-center">
          My Profile 👤
        </h1>

        {/* Profile Info */}
        <div className="space-y-4 text-[rgba(69,50,26,1)]">

          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(178,60,47,1)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Your email"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(178,60,47,1)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              type="text"
              placeholder="Your phone number"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(178,60,47,1)]"
            />
          </div>

        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between">

          <button className="bg-[rgba(178,60,47,1)] text-white px-5 py-2 rounded-lg hover:scale-105 transition">
            Save Changes
          </button>

          <button className="border border-[rgba(178,60,47,1)] text-[rgba(178,60,47,1)] px-5 py-2 rounded-lg hover:bg-[rgba(178,60,47,1)] hover:text-white transition">
            Logout
          </button>

        </div>

      </div>

    </main>
  );
}