import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-orange-500">
          Cuaderno Friki
        </Link>
        <ul className="flex space-x-4">
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
          <li>
            <Link href="/login" className="hover:text-orange-500">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}