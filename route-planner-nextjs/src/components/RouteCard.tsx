"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Route } from "@/types";
import { FAVORITES_KEY } from "@/lib/constants";

interface RouteCardProps {
  route: Route;
  onEdit?: (route: Route) => void;
  onDelete?: (id: number) => void;
  index?: number;
}

export default function RouteCard({ route, onEdit, onDelete, index = 0 }: RouteCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const stored: Route[] = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    setIsSaved(stored.some((r) => r.id === route.id));
  }, [route.id]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "leicht":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-400",
        };
      case "mittel":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          dot: "bg-amber-400",
        };
      case "schwer":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          dot: "bg-rose-400",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "bg-gray-400",
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Wandern":
        return "🥾";
      case "Radfahren":
        return "🚴";
      case "Laufen":
        return "🏃";
      case "Klettern":
        return "🧗";
      default:
        return "📍";
    }
  };

  const difficultyConfig = getDifficultyConfig(route.difficulty);

  return (
    <div 
      className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover animate-fade-in-up opacity-0 stagger-${(index % 6) + 1}`}
    >
      {/* Gradient accent bar at top */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <div className="p-5 flex flex-col h-full">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-2xl border border-indigo-100/50">
            {getCategoryIcon(route.category)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
              {route.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">
              {route.category}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1 leading-relaxed">
          {route.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${difficultyConfig.bg} ${difficultyConfig.text} border ${difficultyConfig.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${difficultyConfig.dot}`} />
            {route.difficulty}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {route.category}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-3 text-center border border-indigo-100">
            <div className="text-lg font-bold text-indigo-700">{route.distance}</div>
            <div className="text-xs text-indigo-500 font-medium">km</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-3 text-center border border-emerald-100">
            <div className="text-lg font-bold text-emerald-700">{route.duration}</div>
            <div className="text-xs text-emerald-500 font-medium">Min.</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Link
            href={`/routen/${route.id}`}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm hover:shadow-md text-center"
          >
            📋 Details
          </Link>
          <button
            onClick={handleToggleFavorite}
            title={isSaved ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
              isSaved
                ? "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
                : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {isSaved ? "⭐" : "☆"}
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(route)}
              className="px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors border border-amber-200"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(route.id)}
              className="px-4 py-2.5 bg-rose-50 text-rose-700 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors border border-rose-200"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
