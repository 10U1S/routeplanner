"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Route, RouteCategory } from "@/types";
import { getRoutes, createRoute, updateRoute, deleteRoute } from "@/app/actions";
import FilterBar from "@/components/FilterBar";
import RouteCard from "@/components/RouteCard";
import RouteForm from "@/components/RouteForm";

export default function RoutesClient({ initialRoutes = [] }: { initialRoutes?: Route[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as RouteCategory | null;

  const [selectedCategory, setSelectedCategory] = useState<RouteCategory | "all">(
    categoryParam || "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshRoutes = async () => {
    setIsLoading(true);
    try {
      const data = await getRoutes();
      setRoutes(data);
    } catch {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRoutes = routes.filter((route) => {
    const matchesCategory = selectedCategory === "all" || route.category === selectedCategory;
    const matchesSearch =
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddRoute = async (newRoute: Route) => {
    await createRoute({
      name: newRoute.name,
      category: newRoute.category,
      difficulty: newRoute.difficulty,
      distance: newRoute.distance,
      duration: newRoute.duration,
      description: newRoute.description,
    });
    setShowForm(false);
    await refreshRoutes();
  };

  const handleEditRoute = async (updatedRoute: Route) => {
    const { id, ...data } = updatedRoute;
    await updateRoute(id, data);
    setEditingRoute(null);
    setShowForm(false);
    await refreshRoutes();
  };

  const handleDeleteRoute = async (id: number) => {
    if (!confirm("Möchten Sie diese Route wirklich löschen?")) {
      return;
    }

    await deleteRoute(id);
    await refreshRoutes();
  };

  const handleStartEdit = (route: Route) => {
    setEditingRoute(route);
    setShowForm(true);
  };

  const handleOpenForm = () => {
    setEditingRoute(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRoute(null);
  };

  return (
    <>
      <FilterBar
        routes={routes}
        onFilterChange={setSelectedCategory}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
      />

      {showForm && (
        <RouteForm
          onSubmit={editingRoute ? handleEditRoute : handleAddRoute}
          onCancel={handleCancel}
          editingRoute={editingRoute}
        />
      )}

      {!showForm && (
        <div className="mb-6">
          <button
            onClick={handleOpenForm}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            + Neue Route hinzufügen
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-gray-500 py-16 dark:text-slate-400">
          <p>Laden...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route, index) => (
              <RouteCard
                key={route.id}
                route={route}
                onEdit={handleStartEdit}
                onDelete={handleDeleteRoute}
                index={index}
              />
            ))}
          </div>

          {filteredRoutes.length === 0 && (
            <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2 dark:text-slate-200">
                Keine Routen gefunden
              </h3>
              <p className="text-gray-500 dark:text-slate-400">
                Versuchen Sie andere Filterkriterien.
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
