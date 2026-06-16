"use client";

import { useState, useEffect } from "react";
import { Route } from "@/types";

const FAVORITES_KEY = "route-planner-favorites";

interface SaveButtonProps {
  route: Route;
}

export default function SaveButton({ route }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    setIsSaved(stored.some((r: Route) => r.id === route.id));
  }, [route.id]);

  const handleToggle = () => {
    const stored: Route[] = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    if (isSaved) {
      const updated = stored.filter((r) => r.id !== route.id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setIsSaved(false);
    } else {
      stored.push(route);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(stored));
      setIsSaved(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-6 py-3.5 rounded-xl font-semibold transition-colors border ${
        isSaved
          ? "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
      }`}
    >
      {isSaved ? "⭐ Gespeichert" : "☆ Speichern"}
    </button>
  );
}
