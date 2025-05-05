"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen text-white">
      <div className="bg-gray-800 p-7 rounded shadow-md w-80 mt-[-300]">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Iniciar sesión
          </button>
          <h3>
            No tienes cuenta?{" "}
            <Link href="/singup" className="hover:text-orange-500">
              Registrate
            </Link>
          </h3>
        </form>
      </div>
    </div>
  );
}