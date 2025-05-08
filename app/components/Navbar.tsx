"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // Importar íconos de usuario
import { AccountCircle } from "@mui/icons-material"; // Importar el ícono de Material-UI

export default function Navbar() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    const storedEmail = localStorage.getItem("email");
    setUid(storedUid);
    setEmail(storedEmail);

    const handleStorageChange = () => {
      const updatedUid = localStorage.getItem("uid");
      const updatedEmail = localStorage.getItem("email");
      setUid(updatedUid);
      setEmail(updatedEmail);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("email");
    setIsDropdownOpen(false);
    setUid(null);
    setEmail(null);
    router.push("/login");
  };

  return (
    <nav className="bg-blue-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
      {uid ? (
        <Link href="/" className="text-xl font-bold hover:text-blue-300">
          Cuaderno Friki
        </Link>
      ): (
        <Link href="/login" className="text-xl font-bold hover:text-blue-300">
          Cuaderno Friki
        </Link>
      )}

        <ul className="flex space-x-4 items-center">
          {uid ? (
            <>
              <li>
                <Link href="/manhwas" className="hover:text-blue-300">
                  Manhwas
                </Link>
              </li>
              <li>
                <Link href="/animes" className="hover:text-blue-300">
                  Animes
                </Link>
              </li>
              <li className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="hover:text-blue-300 focus:outline-none flex items-center"
                >
                  {/* Mostrar el ícono en lugar del email en pantallas pequeñas */}
                  <span className="hidden sm:inline">{email}</span>
                  <a className="sm:hidden">
                    <AccountCircle/>
                  </a>
                </button>
                {isDropdownOpen && (
                  <div className="absolute bg-blue-800 right-0 mt-2 w-48 rounded shadow-lg">
                    
                    <Link
                      onClick={handleLogout}
                      href="/login"
                      className="block px-4 py-2 text-sm hover:bg-blue-700"
                    >
                      Cerrar sesión
                    </Link>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="hover:text-blue-300">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}