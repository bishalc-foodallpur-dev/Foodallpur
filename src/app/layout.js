import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: {
    default: "FoodAllPur",
    template: "%s | FoodAllPur",
  },
  description: "Food delivery app",

  // ✅ Logo / favicon setup
  icons: {
    icon: "/logo1.ico",
    shortcut: "/logo1.png",
    apple: "/logo1.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />

          <main className="pt-20 min-h-screen">
            {children}
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}