import { Suspense } from "react";
import MenuClient from "./MenuClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center p-6">Loading menu...</p>}>
      <MenuClient />
    </Suspense>
  );
}