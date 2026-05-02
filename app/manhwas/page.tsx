"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import ManhwaCard from "../components/ManhwaCard";
import ManhwaFormModal from "../components/ManhwaFormModal";
import { useAuth } from "../hooks/useAuth";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ImportModal from "../components/ImportModal";

export default function ManhwasPage() {
  useAuth();
  const [manhwas, setManhwas] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManhwa, setSelectedManhwa] = useState<any | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({});

  const fetchManhwas = async () => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    try {
      const manhwasQuery = query(collection(db, "Manhwas"), where("User", "==", uid));
      const snapshot = await getDocs(manhwasQuery);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setManhwas(data);
    } catch (error) {
      console.error("Error al obtener los manhwas:", error);
    }
  };

  useEffect(() => {
    fetchManhwas();
  }, []);

  useEffect(() => {
    const daysOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo", "Sin día"];
    const groupedManhwas = manhwas.reduce((acc: any, manhwa) => {
      const day = manhwa.Dia || "Sin día";
      if (!acc[day]) acc[day] = [];
      acc[day].push(manhwa);
      return acc;
    }, {});

    const initialExpanded: { [key: string]: boolean } = {};
    Object.keys(groupedManhwas).forEach((day) => {
      initialExpanded[day] = day !== "Sin día";
    });
    setExpandedDays(initialExpanded);
  }, [manhwas]);

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
    const uid = localStorage.getItem("uid");
    if (!uid) {
      console.error("No hay UID en localStorage");
      return;
    }

    try {
      if (data.id) {
        const manhwaRef = doc(db, "Manhwas", data.id);
        await updateDoc(manhwaRef, {
          Nombre: data.Nombre,
          Capitulo: data.Capitulo,
          Imagen: data.Imagen,
          Dia: data.Dia,
        });
      } else {
        await addDoc(collection(db, "Manhwas"), {
          Nombre: data.Nombre,
          Capitulo: data.Capitulo,
          Imagen: data.Imagen,
          Dia: data.Dia,
          User: uid,
        });
      }

      const manhwasQuery = query(collection(db, "Manhwas"), where("User", "==", uid));
      const snapshot = await getDocs(manhwasQuery);
      const updatedManhwas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setManhwas(updatedManhwas);

      handleCloseModal();
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

  const handleNewRecord = () => {
    handleOpenModal(null);
  };

  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };

  const toggleDay = (day: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const daysOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo", "Sin día"];

  const groupedManhwas = manhwas.reduce((acc: any, manhwa) => {
    const day = manhwa.Dia || "Sin día";
    if (!acc[day]) acc[day] = [];
    acc[day].push(manhwa);
    return acc;
  }, {});

  const sortedDays = Object.keys(groupedManhwas).sort(
    (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
  );

  return (
    <div className="p-5 relative">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-center sm:text-left">
        Manhwas
      </h1>
      <div className="border-b-2 border-gray-500 mb-6"></div>

      {manhwas.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">Sin registros</p>
      ) : (
        sortedDays.map((day) => (
          <div key={day} className="mb-8">
            <button
              onClick={() => toggleDay(day)}
              className="w-full text-left flex items-center justify-between p-4 border-b border-gray-600 hover:opacity-80 transition-opacity mb-4"
            >
              <h2 className="text-3xl font-bold text-white">{day}</h2>
              <span className="text-white text-2xl">
                {expandedDays[day] ? "▼" : "▶"}
              </span>
            </button>
            {expandedDays[day] && (
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
            )}
          </div>
        ))
      )}

      <SpeedDial
        ariaLabel="Opciones"
        icon={<AddIcon />}
        direction="up"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
        }}
      >
        <SpeedDialAction
          icon={<CreateIcon />}
          tooltipTitle="Nuevo registro"
          onClick={handleNewRecord}
        />
        <SpeedDialAction
          icon={<ImportExportIcon />}
          tooltipTitle="Importar"
          onClick={handleOpenImportModal}
        />
      </SpeedDial>

      <ManhwaFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={handleDeleteManhwa}
        initialData={selectedManhwa}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={handleCloseImportModal}
        onImportSuccess={fetchManhwas}
      />
    </div>
  );
}
