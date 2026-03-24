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
    icon: "/logo1.jpeg",
    shortcut: "/logo1.jpeg",
    apple: "/logo1.jpeg",
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