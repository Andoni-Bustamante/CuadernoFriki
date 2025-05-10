import { useState } from "react";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Ajusta la ruta según tu estructura
import Swal from "sweetalert2";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "Manhwa" | "Anime"; // Determina si es para Manhwas o Animes
  onImportSuccess: () => void; // Callback para actualizar la lista después de importar
}

export default function ImportModal({ isOpen, onClose, type, onImportSuccess }: ImportModalProps) {
  const [id, setId] = useState("");

  const handleImport = async () => {
    const uid = localStorage.getItem("uid"); // Obtener la UID del usuario logueado
    if (!uid) {
      Swal.fire({
        title: "Error",
        text: "No se encontró el usuario logueado.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
        background: "#2b2b2b",
        color: "#fff",
      });
      return;
    }

    try {
      // Buscar el registro en Firestore
      const docRef = doc(db, type === "Manhwa" ? "Manhwas" : "Animes", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        Swal.fire({
          title: "Error",
          text: `No se encontró ningún ${type.toLowerCase()} con esa ID.`,
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
          background: "#2b2b2b",
          color: "#fff",
        });
        return;
      }

      const data = docSnap.data();

      // Validar si el registro ya pertenece al usuario actual
      if (data.User === uid) {
        Swal.fire({
          title: "Información",
          text: `Este ${type.toLowerCase()} ya te pertenece.`,
          icon: "info",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
          background: "#2b2b2b",
          color: "#fff",
        });
        return;
      }

      // Crear un nuevo registro con el User actualizado y el capítulo/episodio reiniciado
      const newData = {
        ...data,
        User: uid,
      };

      if (type === "Manhwa") {
        delete (newData as { [key: string]: any })["Episodio"]; // Eliminar el campo Episodio si existe
      } else if (type === "Anime") {
        delete (newData as { [key: string]: any })["Capitulo"];
      }

      await addDoc(collection(db, type === "Manhwa" ? "Manhwas" : "Animes"), newData);

      Swal.fire({
        title: "¡Éxito!",
        text: `${type} importado correctamente.`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
        background: "#2b2b2b",
        color: "#fff",
      });

      onClose(); // Cerrar el modal
      setId(""); // Reiniciar el campo de ID
      onImportSuccess(); // Llamar al callback para actualizar la lista
    } catch (error) {
      console.error("Error al importar:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al importar el registro.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
        background: "#2b2b2b",
        color: "#fff",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-blue-900 text-white p-6 rounded shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Importar {type}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImport();
          }}
        >
          <div className="mb-4">
            <label htmlFor="id" className="block text-sm font-medium mb-2">
              ID del {type}
            </label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full p-2 rounded bg-blue-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Ingresa la ID del ${type.toLowerCase()}`}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Importar
          </button>
        </form>
      </div>
    </div>
  );
}