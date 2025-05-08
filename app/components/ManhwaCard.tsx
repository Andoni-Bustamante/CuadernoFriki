import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { IconButton } from "@mui/material"; // Importar IconButton de Material-UI
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Icono de flecha izquierda
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Icono de flecha derecha


interface ManhwaCardProps {
  id: string; // ID de Firestore
  Nombre: string;
  Capitulo: number;
  Imagen?: string;
  Dia: string;
  onEdit?: () => void; // Prop para abrir el modal
  onUpdateChapter: (id: string, newChapter: number) => void; // Prop para actualizar el capítulo en el estado global
}

export default function ManhwaCard({
  id,
  Nombre,
  Capitulo,
  Imagen,
  Dia,
  onEdit,
  onUpdateChapter,
}: ManhwaCardProps) {
  const updateChapter = async (newChapter: number) => {
    try {
      const manhwaRef = doc(db, "Manhwas", id); // Referencia al documento en Firestore
      await updateDoc(manhwaRef, { Capitulo: newChapter });
      console.log(`Capítulo actualizado a ${newChapter}`);

      // Actualizar el estado global
      onUpdateChapter(id, newChapter);
    } catch (error) {
      console.error("Error al actualizar el capítulo:", error);
    }
  };

  return (
    <div className="border border-stone-400 rounded-lg p-4 shadow-md flex flex-col items-center bg-red-950 text-white w-full sm:w-64">
      <div className="w-full h-80 sm:h-80 flex justify-center items-center overflow-hidden">
        <img
          src={Imagen || "../default.png"} // Imagen por defecto si no hay imagen
          alt={Nombre}
          className="border border-stone-400 rounded-lg object-cover w-full h-full"
        />
      </div>
      <h3
        className="text-lg sm:text-xl font-bold mt-4 text-center cursor-pointer hover:text-red-400 truncate w-full"
        onClick={onEdit} // Llama a la función onEdit al hacer clic
        title={Nombre} // Mostrar el nombre completo al pasar el cursor
      >
        {Nombre}
      </h3>
      <p className="text-lg sm:text-xl text-gray-400 text-center mt-2">{Capitulo}</p>
      <div className="flex gap-2 sm:gap-4 mt-4">
        <IconButton
          onClick={() => updateChapter(Capitulo - 1)} // Retroceder capítulo
          color="error"
          size="large"
        >
          <ArrowBackIcon fontSize="inherit"/>
        </IconButton>
        <IconButton
          onClick={() => updateChapter(Capitulo + 1)} // Avanzar capítulo
          color="error"
          size="large"
        >
          <ArrowForwardIcon fontSize="inherit"/>
        </IconButton>
      </div>
    </div>
  );
}