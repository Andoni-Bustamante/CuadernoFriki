"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      router.push("/login"); // Redirige al login si no hay UID
    }
  }, [router]);
};