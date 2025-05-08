"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Ajusta la ruta según tu estructura
import AnimeCard from "../components/AnimeCard";
import AnimeFormModal from "../components/AnimeFormModal";
import { useAuth } from "../hooks/useAuth";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AnimePage() {
  useAuth();
  const [animes, setAnimes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<any | null>(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      const uid = localStorage.getItem("uid"); // Obtener la UID desde localStorage
      if (!uid) {
        console.error("No hay UID en localStorage");
        return;
      }

      try {
        // Crear una consulta para filtrar por el campo "user"
        const animesQuery = query(collection(db, "Animes"), where("User", "==", uid));
        const snapshot = await getDocs(animesQuery);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAnimes(data);
      } catch (error) {
        console.error("Error al obtener los animes:", error);
      }
    };

    fetchAnimes();
  }, []);

  const handleOpenModal = (anime: any | null = null) => {
    setSelectedAnime(anime);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAnime(null);
    setIsModalOpen(false);
  };

  const handleDeleteAnime = (id: string) => {
    setAnimes((prevAnimes) => prevAnimes.filter((anime) => anime.id !== id));
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
        const animeRef = doc(db, "Animes", data.id);
        await updateDoc(animeRef, {
          Nombre: data.Nombre,
          Episodio: data.Episodio,
          Imagen: data.Imagen,
          Dia: data.Dia,
        });
        console.log("Anime actualizado correctamente");
      } else {
        // Si no hay ID, creamos un nuevo documento
        await addDoc(collection(db, "Animes"), {
          Nombre: data.Nombre,
          Episodio: data.Episodio,
          Imagen: data.Imagen,
          Dia: data.Dia,
          User: uid, // Asociar el anime al usuario logueado
        });
        console.log("Anime creado correctamente");
      }

      // Actualizar la lista de animes después de la inserción/actualización
      const animesQuery = query(collection(db, "Animes"), where("User", "==", uid));
      const snapshot = await getDocs(animesQuery);
      const updatedAnimes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAnimes(updatedAnimes);

      handleCloseModal(); // Cerrar el modal
    } catch (error) {
      console.error("Error al guardar el anime:", error);
    }
  };

  const handleUpdateEpisode = (id: string, newEpisode: number) => {
    setAnimes((prevAnimes) =>
      prevAnimes.map((anime) =>
        anime.id === id ? { ...anime, Episodio: newEpisode } : anime
      )
    );
  };

  // Agrupar animes por día
  const daysOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo", "Sin día"];

  const groupedAnimes = animes.reduce((acc: any, anime) => {
    const day = anime.Dia || "Sin día";
    if (!acc[day]) acc[day] = [];
    acc[day].push(anime);
    return acc;
  }, {});

  // Ordenar los días según el orden definido
  const sortedDays = Object.keys(groupedAnimes).sort(
    (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
  );

  return (
    <div className="p-5 relative">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-center sm:text-left">
        Animes
      </h1>
      <div className="border-b-2 border-gray-500 mb-6"></div>

      {animes.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">Sin registros</p>
      ) : (
        sortedDays.map((day) => (
          <div key={day} className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">{day}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {groupedAnimes[day].map((anime: any) => (
                <AnimeCard
                  key={anime.id}
                  id={anime.id}
                  Nombre={anime.Nombre}
                  Episodio={anime.Episodio}
                  Imagen={anime.Imagen}
                  Dia={anime.Dia}
                  onEdit={() => handleOpenModal(anime)}
                  onUpdateEpisode={handleUpdateEpisode}
                />
              ))}
            </div>
          </div>
        ))
      )}

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

      <AnimeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={handleDeleteAnime}
        initialData={selectedAnime}
      />
    </div>
  );
}