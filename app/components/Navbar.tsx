"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Obtener la UID y el email desde localStorage al cargar el componente
    const storedUid = localStorage.getItem("uid");
    const storedEmail = localStorage.getItem("email");
    setUid(storedUid);
    setEmail(storedEmail);

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      const updatedUid = localStorage.getItem("uid");
      const updatedEmail = localStorage.getItem("email");
      setUid(updatedUid);
      setEmail(updatedEmail);
    };

    window.addEventListener("storage", handleStorageChange);

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Eliminar la UID y el email de localStorage
    localStorage.removeItem("uid");
    localStorage.removeItem("email");
    setIsDropdownOpen(!isDropdownOpen); // Cerrar el dropdown
    setUid(null);
    setEmail(null);
    router.push("/login"); // Redirigir al login
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-orange-500">
          Cuaderno Friki
        </Link>
        <ul className="flex space-x-4">
          {uid ? (
            <>
              <li>
                <Link href="/manhwas" className="hover:text-orange-500">
                  Manhwas
                </Link>
              </li>
              <li>
                <Link href="/animes" className="hover:text-orange-500">
                  Animes
                </Link>
              </li>
              <li className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="hover:text-orange-500 focus:outline-none"
                >
                  {email}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded shadow-lg">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="hover:text-orange-500">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}