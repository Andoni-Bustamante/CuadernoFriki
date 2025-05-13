import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { IconButton, Tooltip } from "@mui/material"; // Importar IconButton y Tooltip de Material-UI
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Icono de flecha izquierda
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Icono de flecha derecha
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Icono de copiar
import Swal from "sweetalert2"; // Importar SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css"; // Importar estilos de SweetAlert2
import NumberFlow from "@number-flow/react";

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id).then(() => {
      console.log(`ID copiado al portapapeles: ${id}`);
      Swal.fire({
        title: "¡ID copiado!",
        text: "El ID del manhwa se ha copiado al portapapeles.",
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
          src={Imagen || "../default.png"} // Imagen por defecto si no hay imagen
          alt={Nombre}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "../default.png"; // Cambiar a imagen por defecto si falla
          }}
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
      <NumberFlow className="text-lg sm:text-xl text-gray-300 text-center mt-2" value={Capitulo} trend={0} format={{ notation: "compact" }} />
      <div className="flex gap-2 sm:gap-4 mt-4">
        <IconButton
          onClick={() => updateChapter(Capitulo - 1)} // Retroceder capítulo
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
          onClick={() => updateChapter(Capitulo + 1)} // Avanzar capítulo
          color="primary"
          size="large"
        >
          <ArrowForwardIcon fontSize="inherit" />
        </IconButton>
      </div>
    </div>
  );
}