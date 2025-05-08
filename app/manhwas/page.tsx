"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Ajusta la ruta según tu estructura
import ManhwaCard from "../components/ManhwaCard";
import ManhwaFormModal from "../components/ManhwaFormModal";
import { useAuth } from "../hooks/useAuth";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

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

  const handleDeleteManhwa = (id: string) => {
    setManhwas((prevManhwas) => prevManhwas.filter((manhwa) => manhwa.id !== id));
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

  // Agrupar manhwas por día
  const daysOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo", "Sin día"];

  // Agrupar manhwas por día
  const groupedManhwas = manhwas.reduce((acc: any, manhwa) => {
    const day = manhwa.Dia || "Sin día";
    if (!acc[day]) acc[day] = [];
    acc[day].push(manhwa);
    return acc;
  }, {});
  
  // Ordenar los días según el orden definido
  const sortedDays = Object.keys(groupedManhwas).sort(
    (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
  );

  return (
    <div className="p-5 relative">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-center sm:text-left">
        Manhwas
      </h1>
      <div className="border-b-2 border-gray-500 mb-6"></div>

      {sortedDays.map((day) => (
        <div key={day} className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">{day}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {groupedManhwas[day].map((manhwa: any) => (
              <ManhwaCard
                key={manhwa.id}
                id={manhwa.id}
                Nombre={manhwa.Nombre}
                Capitulo={manhwa.Capitulo}
                Imagen={manhwa.Imagen}
                Dia={manhwa.Dia}
                onEdit={() => handleOpenModal(manhwa)}
                onUpdateChapter={handleUpdateChapter}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Botón flotante */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleOpenModal(null)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        <AddIcon />
      </Fab>

      <ManhwaFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={handleDeleteManhwa}
        initialData={selectedManhwa}
      />
    </div>
  );
}