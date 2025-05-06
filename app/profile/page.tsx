"use client";
import { useAuth } from "../hooks/useAuth";

export default function ProfilePage() {
  useAuth();
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Perfil</h2>
      <p>Esta es la sección de perfil.</p>
    </div>
  );
}