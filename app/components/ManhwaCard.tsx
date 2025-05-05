interface ManhwaCardProps {
    id?: string; // ID de Firestore
    Nombre: string;
    Capitulo: number;
    Imagen?: string;
    Dia: string;
}

export default function ManhwaCard({ Nombre, Capitulo, Imagen, Dia }: ManhwaCardProps) {
    return (
      <div className="border rounded-lg p-4 shadow-md flex flex-col items-start bg-gray-800 text-white">
        <img
          src={Imagen || "/default-image.png"}
          alt={Nombre}
          width={150}
          height={200}
          className="rounded w-full object-cover"
        />
        <h3 className="text-lg font-bold mt-2">{Nombre}</h3>
        <p className="text-sm text-gray-400">Capítulo actual: {Capitulo}</p>
        <div className="flex gap-2 mt-2">
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">-</button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">+</button>
        </div>
      </div>
    );
  }