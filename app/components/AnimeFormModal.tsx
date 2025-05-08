import { deleteDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { db } from "../firebase/config";

interface AnimeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onDelete: (id: string) => void;
  initialData?: {
    id?: string;
    Nombre: string;
    Episodio: number;
    Imagen?: string;
    Dia: string;
  };
}

export default function AnimeFormModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData,
}: AnimeFormModalProps) {
  const [nombre, setNombre] = useState(initialData?.Nombre || "");
  const [episodio, setEpisodio] = useState(initialData?.Episodio || 0);
  const [imagen, setImagen] = useState(initialData?.Imagen || "");
  const [dia, setDia] = useState(initialData?.Dia || "");
  const [isValidImage, setIsValidImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.Nombre);
      setEpisodio(initialData.Episodio);
      setImagen(initialData.Imagen || "");
      setDia(initialData.Dia);
    } else {
      setNombre("");
      setEpisodio(0);
      setImagen("");
      setDia("");
    }
  }, [initialData]);

  useEffect(() => {
    if (imagen) {
      const img = new Image();
      img.src = imagen;
      img.onload = () => setIsValidImage(true);
      img.onerror = () => setIsValidImage(false);
    } else {
      setIsValidImage(false);
    }
  }, [imagen]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      color: "#fff",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#2b2b2b",
    });

    if (!result.isConfirmed) return;

    try {
      const animeRef = doc(db, "Animes", initialData?.id || "");
      await deleteDoc(animeRef);
      Swal.fire("¡Eliminado!", "El anime ha sido eliminado correctamente.", "success");
      onDelete(initialData?.id || "");
      onClose();
    } catch (error) {
      console.error("Error al eliminar el anime:", error);
      Swal.fire("Error", "Hubo un problema al eliminar el anime.", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-blue-900 text-white p-6 rounded shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl relative flex flex-col sm:flex-row">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <div className="w-full sm:w-2/3 pr-0 sm:pr-4">
          <h2 className="text-xl font-bold mb-4 text-center sm:text-left">
            {initialData ? "Editar Anime" : "Crear Anime"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit({
                id: initialData?.id,
                Nombre: nombre,
                Episodio: episodio,
                Imagen: imagen,
                Dia: dia,
              });
              setNombre("");
              setEpisodio(0);
              setImagen("");
              setDia("");
            }}
          >
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 rounded bg-blue-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="episodio" className="block text-sm font-medium mb-2">
                Episodio
              </label>
              <input
                type="number"
                id="episodio"
                value={episodio}
                onChange={(e) => setEpisodio(Number(e.target.value))}
                className="w-full p-2 rounded bg-blue-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="imagen" className="block text-sm font-medium mb-2">
                Imagen (URL)
              </label>
              <input
                type="text"
                id="imagen"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                className="w-full p-2 rounded bg-blue-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!isValidImage && imagen && (
                <p className="text-red-500 text-sm mt-2">
                  La URL de la imagen no es válida.
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="dia" className="block text-sm font-medium mb-2">
                Día
              </label>
              <select
                id="dia"
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                className="w-full p-2 rounded bg-blue-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un día</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {initialData ? "Guardar Cambios" : "Crear"}
            </button>
          </form>
          {initialData && (
            <button
              onClick={handleDelete}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Eliminar
            </button>
          )}
        </div>
        {isValidImage && (
          <div className="hidden sm:flex w-full sm:w-1/3 justify-center items-center mb-11 ml-5">
            <div className="border rounded-lg shadow-md text-white w-70 h-70">
              <div className="w-full h-full flex justify-center items-center overflow-hidden">
                <img
                  src={imagen}
                  alt="Previsualización"
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
        {!isValidImage && (
          <div className="hidden sm:flex w-full sm:w-1/3 justify-center items-center mt-4">
            <div className="border rounded-lg shadow-md text-white w-70 h-72">
              <div className="w-full h-full flex justify-center items-center overflow-hidden">
                <img
                  src="../animeDefault.png"
                  alt="Previsualización"
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}