import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "FoodAllpur",
  description: "Food delivery app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}