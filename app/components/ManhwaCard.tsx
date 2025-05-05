interface ManhwaCardProps {
  id?: string; // ID de Firestore
  Nombre: string;
  Capitulo: number;
  Imagen?: string;
  Dia: string;
}

export default function ManhwaCard({ Nombre, Capitulo, Imagen, Dia }: ManhwaCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col items-center bg-gray-800 text-white w-64">
      <div className="w-full h-56 flex justify-center items-center overflow-hidden">
        <img
          src={Imagen || "/default-image.png"}
          alt={Nombre}
          className="object-cover w-full h-full"
        />
      </div>
      <h3 className="text-xl font-bold mt-4 text-center">{Nombre}</h3>
      <p className="text-xl text-gray-400 text-center mt-2">{Capitulo}</p>
      <div className="flex gap-4 mt-4">
        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          ←
        </button>
        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          →
        </button>
      </div>
    </div>
  );
}