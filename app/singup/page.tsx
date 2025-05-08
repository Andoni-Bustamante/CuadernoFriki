"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config"; // Importa la configuración de Firebase
import Swal from "sweetalert2"; // Importa SweetAlert2

export default function SingupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
        confirmButtonColor: "#d33",
      });
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Registro exitoso
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "Usuario registrado correctamente",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          router.push("/login"); // Redirige al login después del registro
        });
      })
      .catch((error) => {
        // Error en el registro
        Swal.fire({
          icon: "error",
          title: "Error al registrar usuario",
          text: error.message,
          confirmButtonColor: "#d33",
        });
      });
  };

  return (
    <div className="flex justify-center items-center h-screen text-white">
      <div className="bg-blue-900 p-6 rounded shadow-md w-80  mt-[-270]">
        <h2 className="text-2xl font-bold mb-4 text-center">Regístrate</h2>
        <form onSubmit={handleSignup}>
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
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Repite tu contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded bg-blue-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}