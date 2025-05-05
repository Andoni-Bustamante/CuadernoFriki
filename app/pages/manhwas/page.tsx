"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config"; // Adjusted the import path
import ManhwaCard from "../../components/ManhwaCard";

export default function ManhwasPage() {
  const [manhwas, setManhwas] = useState<any[]>([]);

  useEffect(() => {
    const fetchManhwas = async () => {
      const snapshot = await getDocs(collection(db, "Manhwas"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setManhwas(data);
    };

    fetchManhwas();
  }, []);

  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {manhwas.map((m) => (
        <ManhwaCard key={m.id} Nombre={m.Nombre} Capitulo={m.Capitulo} Imagen={m.Imagen} Dia={m.Dia} />
      ))}
    </main>
  );
  }