import { deleteDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { db } from "../firebase/config";

interface ManhwaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onDelete: (id: string) => void; // Nueva prop para manejar la eliminación
  initialData?: {
    id?: string;
    Nombre: string;
    Capitulo: number;
    Imagen?: string;
    Dia: string;
  };
}

export default function ManhwaFormModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete, // Recibir la nueva prop
  initialData,
}: ManhwaFormModalProps) {
  const [nombre, setNombre] = useState(initialData?.Nombre || "");
  const [capitulo, setCapitulo] = useState(initialData?.Capitulo || 0);
  const [imagen, setImagen] = useState(initialData?.Imagen || "");
  const [dia, setDia] = useState(initialData?.Dia || "");
  const [isValidImage, setIsValidImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.Nombre);
      setCapitulo(initialData.Capitulo);
      setImagen(initialData.Imagen || "");
      setDia(initialData.Dia);
    } else {
      setNombre("");
      setCapitulo(0);
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
      const manhwaRef = doc(db, "Manhwas", initialData?.id || "");
      await deleteDoc(manhwaRef);
      Swal.fire("¡Eliminado!", "El manhwa ha sido eliminado correctamente.", "success");
      onDelete(initialData?.id || ""); // Llamar a la función para actualizar la lista
      onClose(); // Cerrar el modal después de eliminar
    } catch (error) {
      console.error("Error al eliminar el manhwa:", error);
      Swal.fire("Error", "Hubo un problema al eliminar el manhwa.", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded shadow-lg w-[600px] relative flex">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <div className="w-2/3 pr-4">
          <h2 className="text-xl font-bold mb-4">
            {initialData ? "Editar Manhwa" : "Crear Manhwa"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit({
                id: initialData?.id,
                Nombre: nombre,
                Capitulo: capitulo,
                Imagen: imagen,
                Dia: dia,
              });
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
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="capitulo" className="block text-sm font-medium mb-2">
                Capítulo
              </label>
              <input
                type="number"
                id="capitulo"
                value={capitulo}
                onChange={(e) => setCapitulo(Number(e.target.value))}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {initialData ? "Guardar Cambios" : "Crear"}
            </button>
          </form>
          {initialData && (
            <button
              onClick={handleDelete}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Eliminar
            </button>
          )}
        </div>
        {isValidImage && (
          <div className="w-1/3 flex justify-center items-center">
            <div className="border rounded-lg p-4 shadow-md bg-gray-800 text-white w-64">
              <div className="w-full h-56 flex justify-center items-center overflow-hidden">
                <img
                  src={imagen}
                  alt="Previsualización"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}