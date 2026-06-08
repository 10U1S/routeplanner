"use client";

import { useState, useEffect } from "react";
import type { Route, RouteFormProps, Difficulty, RouteCategory } from "@/types";

export default function RouteForm({ onSubmit, onCancel, editingRoute }: RouteFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<RouteCategory>("Wandern");
  const [difficulty, setDifficulty] = useState<Difficulty>("leicht");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingRoute) {
      setName(editingRoute.name);
      setCategory(editingRoute.category);
      setDifficulty(editingRoute.difficulty);
      setDistance(String(editingRoute.distance));
      setDuration(String(editingRoute.duration));
      setDescription(editingRoute.description);
    }
  }, [editingRoute]);

  const nameError = name.length > 0 && name.length < 3;
  const distanceError = distance && (isNaN(Number(distance)) || Number(distance) <= 0);
  const durationError = duration && (isNaN(Number(duration)) || Number(duration) <= 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nameError || distanceError || durationError || !name || !distance || !duration) {
      return;
    }

    setIsSubmitting(true);

    const route: Route = {
      id: editingRoute?.id ?? 0,
      name,
      category,
      difficulty,
      distance: Number(distance),
      duration: Number(duration),
      description,
      imageUrl: "",
    };

    try {
      await onSubmit(route);
    } catch (error) {
      console.error("Failed to submit route:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { value: RouteCategory; icon: string; label: string }[] = [
    { value: "Wandern", icon: "🥾", label: "Wandern" },
    { value: "Radfahren", icon: "🚴", label: "Radfahren" },
    { value: "Laufen", icon: "🏃", label: "Laufen" },
    { value: "Klettern", icon: "🧗", label: "Klettern" },
  ];

  const difficulties: { value: Difficulty; icon: string; label: string; color: string }[] = [
    { value: "leicht", icon: "🟢", label: "Leicht", color: "emerald" },
    { value: "mittel", icon: "🟡", label: "Mittel", color: "amber" },
    { value: "schwer", icon: "🔴", label: "Schwer", color: "rose" },
  ];

  const inputClassName = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-400 focus:bg-white focus:outline-none transition-all text-sm";

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg shadow-indigo-500/25">
          {editingRoute ? "✏️" : "➕"}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {editingRoute ? "Route bearbeiten" : "Neue Route hinzufügen"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {editingRoute ? "Ändere die Details deiner Route" : "Erstelle eine neue Route für die Community"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Routenname <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Waldweg Runde"
            className={inputClassName}
            autoFocus
          />
          {nameError && (
            <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Name muss mindestens 3 Zeichen haben
            </p>
          )}
        </div>

        {/* Category Selection - Pill Buttons */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            🎯 Kategorie
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  category === cat.value
                    ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/10"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className={`text-sm font-semibold ${
                  category === cat.value ? "text-indigo-700" : "text-gray-600"
                }`}>
                  {cat.label}
                </span>
                {category === cat.value && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection - Segmented Control */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            📊 Schwierigkeit
          </label>
          <div className="inline-flex rounded-xl border-2 border-gray-200 bg-gray-50 p-1">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                type="button"
                onClick={() => setDifficulty(diff.value)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  difficulty === diff.value
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>{diff.icon}</span>
                <span>{diff.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Distance & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Distanz (km) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="z.B. 5.2"
                step="0.1"
                min="0"
                className={`${inputClassName} pr-12`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                km
              </span>
            </div>
            {distanceError && (
              <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Bitte eine gültige Distanz eingeben
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dauer (Minuten) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="z.B. 75"
                min="0"
                className={`${inputClassName} pr-16`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                Minuten
              </span>
            </div>
            {durationError && (
              <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Bitte eine gültige Dauer eingeben
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Beschreibung
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibe die Route, Highlights und Besonderheiten..."
            rows={3}
            className={`${inputClassName} resize-none`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!!nameError || !!distanceError || !!durationError || !name || !distance || !duration || isSubmitting}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Speichern...
              </span>
            ) : editingRoute ? "Änderungen speichern" : "Route erstellen"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors border border-gray-200"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
