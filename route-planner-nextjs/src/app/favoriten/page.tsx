"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RouteCard from "@/components/RouteCard";
import { Route } from "@/types";
import { FAVORITES_KEY } from "@/lib/constants";

export default function FavoritenPage() {
  const [favorites, setFavorites] = useState<Route[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    setFavorites(stored);
    setMounted(true);
  }, []);

  const handleRemove = (id: number) => {
    const updated = favorites.filter((r) => r.id !== id);
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">⭐</span>
            <h1 className="text-3xl font-bold text-gray-800">Meine Favoriten</h1>
          </div>
          <p className="text-gray-500 ml-14">
            {favorites.length === 0
              ? "Noch keine Routen gespeichert."
              : `${favorites.length} Route${favorites.length !== 1 ? "n" : ""} gespeichert`}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4">☆</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Keine Favoriten vorhanden</h2>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              Öffne eine Route und klicke auf &quot;Speichern&quot;, um sie hier zu sehen.
            </p>
            <Link
              href="/routen"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              🥾 Routen entdecken
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((route, index) => (
              <RouteCard
                key={route.id}
                route={route}
                index={index}
                onDelete={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
