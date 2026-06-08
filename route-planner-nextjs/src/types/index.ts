// Zentrale Typdefinitionen für die Route Planner App

export type Difficulty = "leicht" | "mittel" | "schwer";

export type RouteCategory = "Wandern" | "Radfahren" | "Laufen" | "Klettern";

export interface Route {
  id: number;
  name: string;
  distance: number;  // in Kilometern
  duration: number;  // in Minuten
  difficulty: Difficulty;
  category: RouteCategory;
  description: string;
  imageUrl?: string;
}

// Props-Typen für Komponenten
export interface RouteFormProps {
  onSubmit: (route: Route) => void;
  onCancel: () => void;
  editingRoute?: Route | null;
}
