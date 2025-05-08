"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase/config"; // Ajusta la ruta según tu estructura
import { useAuth } from "./hooks/useAuth";
import ManhwaCard from "./components/ManhwaCard";
import AnimeCard from "./components/AnimeCard";

export default function HomePage() {
  useAuth();
  const [manhwas, setManhwas] = useState<any[]>([]);
  const [animes, setAnimes] = useState<any[]>([]);

  useEffect(() => {
    const fetchManhwas = async () => {
      const uid = localStorage.getItem("uid"); // Obtener la UID desde localStorage
      if (!uid) {
        console.error("No hay UID en localStorage");
        return;
      }

      try {
        // Crear una consulta para filtrar por el campo "User" y el día actual
        const manhwasQuery = query(
          collection(db, "Manhwas"),
          where("User", "==", uid),
          where("Dia", "==", getTodayDay())
        );
        const snapshot = await getDocs(manhwasQuery);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setManhwas(data);
      } catch (error) {
        console.error("Error al obtener los manhwas:", error);
      }
    };

    const fetchAnimes = async () => {
      const uid = localStorage.getItem("uid"); // Obtener la UID desde localStorage
      if (!uid) {
        console.error("No hay UID en localStorage");
        return;
      }

      try {
        // Crear una consulta para filtrar por el campo "User" y el día actual
        const animesQuery = query(
          collection(db, "Animes"),
          where("User", "==", uid),
          where("Dia", "==", getTodayDay())
        );
        const snapshot = await getDocs(animesQuery);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAnimes(data);
      } catch (error) {
        console.error("Error al obtener los animes:", error);
      }
    };

    fetchManhwas();
    fetchAnimes();
  }, []);

  function getTodayDay() {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const today = new Date();
    return days[today.getDay()];
  }

  async function handleUpdateChapter(id: string, newChapter: number): Promise<void> {
    try {
      const manhwaDoc = doc(db, "Manhwas", id);
      await updateDoc(manhwaDoc, { Capitulo: newChapter });
      setManhwas((prevManhwas) =>
        prevManhwas.map((manhwa) =>
          manhwa.id === id ? { ...manhwa, Capitulo: newChapter } : manhwa
        )
      );
    } catch (error) {
      console.error("Error al actualizar el capítulo:", error);
    }
  }

  async function handleUpdateEpisode(id: string, newEpisode: number): Promise<void> {
    try {
      const animeDoc = doc(db, "Animes", id);
      await updateDoc(animeDoc, { Episodio: newEpisode });
      setAnimes((prevAnimes) =>
        prevAnimes.map((anime) =>
          anime.id === id ? { ...anime, Episodio: newEpisode } : anime
        )
      );
    } catch (error) {
      console.error("Error al actualizar el episodio:", error);
    }
  }

  return (
    <div className="p-5 relative">
      {/* Sección de Manhwas */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-center sm:text-left">
        Manhwas del {getTodayDay()}
      </h1>
      <div className="border-b-2 border-gray-500 mb-6"></div>

      {manhwas.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">Sin registros</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full mx-auto">
          {manhwas.map((m) => (
            <ManhwaCard
              key={m.id}
              id={m.id}
              Nombre={m.Nombre}
              Capitulo={m.Capitulo}
              Imagen={m.Imagen}
              Dia={m.Dia}
              onUpdateChapter={handleUpdateChapter}
            />
          ))}
        </div>
      )}

      {/* Sección de Animes */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-10 mb-4 text-center sm:text-left">
        Animes del {getTodayDay()}
      </h1>
      <div className="border-b-2 border-gray-500 mb-6"></div>

      {animes.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">Sin registros</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full mx-auto">
          {animes.map((a) => (
            <AnimeCard
              key={a.id}
              id={a.id}
              Nombre={a.Nombre}
              Episodio={a.Episodio}
              Imagen={a.Imagen}
              Dia={a.Dia}
              onUpdateEpisode={handleUpdateEpisode}
            />
          ))}
        </div>
      )}
    </div>
  );
}