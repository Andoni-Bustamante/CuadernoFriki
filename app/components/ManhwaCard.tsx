import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

interface ManhwaCardProps {
  id: string; // ID de Firestore
  Nombre: string;
  Capitulo: number;
  Imagen?: string;
  Dia: string;
}

export default function ManhwaCard({ id, Nombre, Capitulo, Imagen, Dia }: ManhwaCardProps) {
  const [currentChapter, setCurrentChapter] = useState(Capitulo); // Estado local para el capítulo

  const updateChapter = async (newChapter: number) => {
    try {
      const manhwaRef = doc(db, "Manhwas", id); // Referencia al documento en Firestore
      await updateDoc(manhwaRef, { Capitulo: newChapter });
      setCurrentChapter(newChapter); // Actualizar el estado local
      console.log(`Capítulo actualizado a ${newChapter}`);
    } catch (error) {
      console.error("Error al actualizar el capítulo:", error);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col items-center bg-gray-800 text-white w-64">
      <div className="w-full h-56 flex justify-center items-center overflow-hidden">
        <img
          src={Imagen || "../default.png"} // Imagen por defecto si no hay imagen
          alt={Nombre}
          className="object-cover w-full h-full"
        />
      </div>
      <h3 className="text-xl font-bold mt-4 text-center">{Nombre}</h3>
      <p className="text-xl text-gray-400 text-center mt-2">{currentChapter}</p>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => updateChapter(currentChapter - 1)} // Retroceder capítulo
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ←
        </button>
        <button
          onClick={() => updateChapter(currentChapter + 1)} // Avanzar capítulo
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          →
        </button>
      </div>
    </div>
  );
}