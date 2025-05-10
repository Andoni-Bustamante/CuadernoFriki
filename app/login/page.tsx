"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config"; // Importa la configuración de Firebase
import Swal from "sweetalert2"; // Importa SweetAlert2

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar la UID en localStorage
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("email", user.email || "");

      // Actualizar manualmente el estado de UID en el Navbar
      const event = new Event("storage");
      window.dispatchEvent(event);

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido de nuevo",
        background: "#193cb8",
        color: "#fff",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        router.push("/"); // Redirigir a la página principal después del login
      });
    } catch (err) {
      console.error("Error al iniciar sesión:", err);

      // Mostrar mensaje de error
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Correo o contraseña incorrectos",
        background: "#193cb8",
        color: "#fff",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen text-white">
      <div className="bg-blue-900 p-7 rounded shadow-md w-80 mt-[-300]">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-blue-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-blue-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Iniciar sesión
          </button>
          <h3>
            No tienes cuenta?{" "}
            <a href="/singup" className="hover:text-blue-300">
              Regístrate
            </a>
          </h3>
        </form>
      </div>
    </div>
  );
}