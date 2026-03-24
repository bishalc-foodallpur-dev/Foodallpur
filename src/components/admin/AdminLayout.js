"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-lg transition ${
      pathname === path
        ? "bg-[rgba(178,60,47,1)] text-white"
        : "text-[rgba(69,50,26,1)] hover:bg-[rgba(251,244,236,1)]"
    }`;

  return (
    <div className="flex min-h-screen bg-[rgba(251,244,236,1)]">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block border-r border-[rgba(69,50,26,0.1)]">
        
        <h2 className="text-xl font-bold text-[rgba(178,60,47,1)] mb-8">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-2">
          <Link href="/admin" className={navLinkClass("/admin")}>
            Dashboard
          </Link>

          <Link href="/admin/add-food" className={navLinkClass("/admin/add-food")}>
            Add Food
          </Link>

          <Link href="/admin/manage-food" className={navLinkClass("/admin/manage-food")}>
            Manage Food
          </Link>

          <Link href="/admin/orders" className={navLinkClass("/admin/orders")}>
            Orders
          </Link>
        </nav>

        <button
          onClick={() => router.push("/")}
          className="mt-10 w-full bg-[rgba(69,50,26,1)] hover:opacity-90 text-white py-2 rounded-lg transition"
        >
          Back to Site
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 text-[rgba(69,50,26,1)]">
        {children}
      </main>

    </div>
  );
}