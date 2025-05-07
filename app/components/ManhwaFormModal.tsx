import { useState, useEffect } from "react";

interface ManhwaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
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
    // Validar si la URL de la imagen es válida
    if (imagen) {
      const img = new Image();
      img.src = imagen;
      img.onload = () => setIsValidImage(true);
      img.onerror = () => setIsValidImage(false);
    } else {
      setIsValidImage(false);
    }
  }, [imagen]);

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