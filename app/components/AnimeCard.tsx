import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { IconButton, Tooltip } from "@mui/material"; // Importar IconButton y Tooltip de Material-UI
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Icono de flecha izquierda
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Icono de flecha derecha
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Icono de copiar
import Swal from "sweetalert2"; // Importar SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css"; // Importar estilos de SweetAlert2

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id).then(() => {
      console.log(`ID copiado al portapapeles: ${id}`);
      Swal.fire({
        title: "¡ID copiado!",
        text: "El ID del anime se ha copiado al portapapeles.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
        background: "#193cb8",
        color: "#fff",
      });
    });
  };

  return (
    <div className="relative border border-stone-400 rounded-lg p-4 shadow-md flex flex-col items-center bg-blue-900 text-white w-full sm:w-64">

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
        <Tooltip title="Copiar ID">
          <IconButton
            onClick={copyToClipboard}
            className="text-gray-400 hover:text-white"
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
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