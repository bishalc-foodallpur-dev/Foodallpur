import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "FoodAllPur",
  description: "Food delivery app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />

          {/* Add padding-top so content is not hidden behind fixed navbar */}
          <main className="pt-20">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}