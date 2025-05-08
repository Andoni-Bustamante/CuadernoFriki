import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { IconButton } from "@mui/material"; // Importar IconButton de Material-UI
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Icono de flecha izquierda
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Icono de flecha derecha

interface AnimeCardProps {
  id: string; // ID de Firestore
  Nombre: string;
  Episodio: number;
  Imagen?: string;
  Dia: string;
  onEdit?: () => void; // Prop para abrir el modal
  onUpdateEpisode: (id: string, newEpisode: number) => void; // Prop para actualizar el episodio en el estado global
}

export default function AnimeCard({
  id,
  Nombre,
  Episodio,
  Imagen,
  Dia,
  onEdit,
  onUpdateEpisode,
}: AnimeCardProps) {
  const updateEpisode = async (newEpisode: number) => {
    try {
      const animeRef = doc(db, "Animes", id); // Referencia al documento en Firestore
      await updateDoc(animeRef, { Episodio: newEpisode });
      console.log(`Episodio actualizado a ${newEpisode}`);

      // Actualizar el estado global
      onUpdateEpisode(id, newEpisode);
    } catch (error) {
      console.error("Error al actualizar el episodio:", error);
    }
  };

  return (
    <div className="border border-stone-400 rounded-lg p-4 shadow-md flex flex-col items-center bg-blue-900 text-white w-full sm:w-64">
      <div className="w-full h-80 sm:h-80 flex justify-center items-center overflow-hidden">
        <img
          src={Imagen || "../animeDefault.png"} // Imagen por defecto si no hay imagen
          alt={Nombre}
          className="border border-stone-400 rounded-lg object-cover w-full h-full"
        />
      </div>
      <h3
        className="text-lg sm:text-xl font-bold mt-4 text-center cursor-pointer hover:text-blue-300 truncate w-full"
        onClick={onEdit} // Llama a la función onEdit al hacer clic
        title={Nombre} // Mostrar el nombre completo al pasar el cursor
      >
        {Nombre}
      </h3>
      <p className="text-lg sm:text-xl text-gray-300 text-center mt-2">{Episodio}</p>
      <div className="flex gap-2 sm:gap-4 mt-4">
        <IconButton
          onClick={() => updateEpisode(Episodio - 1)} // Retroceder episodio
          color="primary"
          size="large"
        >
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          onClick={() => updateEpisode(Episodio + 1)} // Avanzar episodio
          color="primary"
          size="large"
        >
          <ArrowForwardIcon fontSize="inherit" />
        </IconButton>
      </div>
    </div>
  );
}