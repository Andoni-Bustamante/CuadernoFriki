"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Ajusta la ruta según tu estructura
import ManhwaCard from "../components/ManhwaCard";
import ManhwaFormModal from "../components/ManhwaFormModal";
import { useAuth } from "../hooks/useAuth";

export default function ManhwasPage() {
  useAuth();
  const [manhwas, setManhwas] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManhwa, setSelectedManhwa] = useState<any | null>(null);

  useEffect(() => {
    const fetchManhwas = async () => {
      const uid = localStorage.getItem("uid"); // Obtener la UID desde localStorage
      if (!uid) {
        console.error("No hay UID en localStorage");
        return;
      }

      try {
        // Crear una consulta para filtrar por el campo "user"
        const manhwasQuery = query(collection(db, "Manhwas"), where("User", "==", uid));
        const snapshot = await getDocs(manhwasQuery);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setManhwas(data);
      } catch (error) {
        console.error("Error al obtener los manhwas:", error);
      }
    };

    fetchManhwas();
  }, []);

  const handleOpenModal = (manhwa: any | null = null) => {
    setSelectedManhwa(manhwa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedManhwa(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: any) => {
    const uid = localStorage.getItem("uid"); // Obtener la UID del usuario logueado
    if (!uid) {
      console.error("No hay UID en localStorage");
      return;
    }

    try {
      if (data.id) {
        // Si hay un ID, actualizamos el documento existente
        const manhwaRef = doc(db, "Manhwas", data.id);
        await updateDoc(manhwaRef, {
          Nombre: data.Nombre,
          Capitulo: data.Capitulo,
          Imagen: data.Imagen,
          Dia: data.Dia,
        });
        console.log("Manhwa actualizado correctamente");
      } else {
        // Si no hay ID, creamos un nuevo documento
        await addDoc(collection(db, "Manhwas"), {
          Nombre: data.Nombre,
          Capitulo: data.Capitulo,
          Imagen: data.Imagen,
          Dia: data.Dia,
          User: uid, // Asociar el manhwa al usuario logueado
        });
        console.log("Manhwa creado correctamente");
      }

      // Actualizar la lista de manhwas después de la inserción/actualización
      const manhwasQuery = query(collection(db, "Manhwas"), where("User", "==", uid));
      const snapshot = await getDocs(manhwasQuery);
      const updatedManhwas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setManhwas(updatedManhwas);

      handleCloseModal(); // Cerrar el modal
    } catch (error) {
      console.error("Error al guardar el manhwa:", error);
    }
  };

  const handleUpdateChapter = (id: string, newChapter: number) => {
    setManhwas((prevManhwas) =>
      prevManhwas.map((manhwa) =>
        manhwa.id === id ? { ...manhwa, Capitulo: newChapter } : manhwa
      )
    );
  };

  return (
    <div className="p-6">
      <button
        onClick={() => handleOpenModal(null)}
        className="mb-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Crear Manhwa
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {manhwas.map((m) => (
          <ManhwaCard
            key={m.id}
            id={m.id}
            Nombre={m.Nombre}
            Capitulo={m.Capitulo}
            Imagen={m.Imagen}
            Dia={m.Dia}
            onEdit={() => handleOpenModal(m)}
            onUpdateChapter={handleUpdateChapter} // Pasar la función para actualizar el capítulo
          />
        ))}
      </div>
      <ManhwaFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedManhwa}
      />
    </div>
  );
}