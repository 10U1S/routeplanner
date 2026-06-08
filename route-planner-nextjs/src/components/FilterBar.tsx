"use client";

import { useState } from "react";
import { Route, RouteCategory } from "@/types";

interface FilterBarProps {
  routes: Route[];
  onFilterChange: (category: RouteCategory | "all") => void;
  onSearchChange: (searchTerm: string) => void;
  selectedCategory: RouteCategory | "all";
}

export default function FilterBar({
  routes,
  onFilterChange,
  onSearchChange,
  selectedCategory,
}: FilterBarProps) {
  const categories: (RouteCategory | "all")[] = [
    "all",
    "Wandern",
    "Radfahren",
    "Laufen",
    "Klettern",
  ];

  const getCategoryCount = (category: RouteCategory | "all") => {
    if (category === "all") return routes.length;
    return routes.filter((r) => r.category === category).length;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Search */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2.5">
            🔍 Routen suchen
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Routenname oder Beschreibung..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-400 focus:bg-white focus:outline-none transition-all text-sm"
            />
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="lg:w-auto">
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">
            🎯 Kategorie
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const count = getCategoryCount(category);
              const isActive = selectedCategory === category;
              
              return (
                <button
                  key={category}
                  onClick={() => onFilterChange(category)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {category === "all" ? "Alle" : category}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive 
                        ? "bg-white/20 text-white" 
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
