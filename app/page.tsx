"use client";
import { useAuth } from "./hooks/useAuth";

export default function HomePage() {
  useAuth();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Home</h2>
      <p>Esta es la sección de home.</p>
    </div>
  );
}