import { Route, Difficulty, RouteCategory } from "@/types";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "route-planner-data.json");

interface StoredRoute {
  id: number;
  name: string;
  distance: number;
  duration: number;
  difficulty: Difficulty;
  category: RouteCategory;
  description: string;
}

const defaultRoutes: StoredRoute[] = [
  { id: 1, name: "Waldweg Runde", distance: 5.2, duration: 75, difficulty: "leicht", category: "Wandern", description: "Schöne Runde durch den Wald mit flachen Wegen." },
  { id: 2, name: "Bergauf Challenge", distance: 8.7, duration: 120, difficulty: "schwer", category: "Wandern", description: "Anspruchsvolle Tour mit steilen Anstiegen." },
  { id: 3, name: "Flussufer Weg", distance: 3.5, duration: 50, difficulty: "leicht", category: "Laufen", description: "Entspannter Spaziergang entlang des Flusses." },
  { id: 4, name: "Alpenüberquerung", distance: 25.0, duration: 480, difficulty: "schwer", category: "Wandern", description: "Mehrtägige Tour über die Alpen mit atemberaubenden Ausblicken." },
  { id: 5, name: "Stadtradtour", distance: 12.5, duration: 90, difficulty: "mittel", category: "Radfahren", description: "Gemütliche Radtour durch die Innenstadt mit vielen Sehenswürdigkeiten." },
  { id: 6, name: "Klettersteig", distance: 3.0, duration: 180, difficulty: "schwer", category: "Klettern", description: "Herausfordernder Klettersteig mit gesicherten Passagen." },
];

function loadRoutes(): StoredRoute[] {
  try {
    if (existsSync(DATA_FILE)) {
      const data = readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // Fallback to default data
  }
  return defaultRoutes;
}

function saveRoutes(routes: StoredRoute[]) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(routes, null, 2));
  } catch {
    // Ignore write errors
  }
}

function toRoute(r: StoredRoute): Route {
  return { ...r, imageUrl: undefined };
}

function toStoredRoute(r: Route): StoredRoute {
  const { imageUrl, ...rest } = r;
  return rest as StoredRoute;
}

export function getRoutes(): Route[] {
  return loadRoutes().map(toRoute);
}

export function getRoute(id: string): Route | null {
  const routes = loadRoutes();
  const routeId = Number(id);
  if (isNaN(routeId)) return null;
  const found = routes.find((r) => r.id === routeId);
  if (!found) return null;
  return toRoute(found);
}

export function addRoute(route: Omit<Route, "id">): Route {
  const routes = loadRoutes();
  const newRoute: StoredRoute = {
    ...route,
    id: routes.length > 0 ? Math.max(...routes.map((r) => r.id)) + 1 : 1,
  } as StoredRoute;
  routes.push(newRoute);
  saveRoutes(routes);
  return toRoute(newRoute);
}

export function updateRoute(id: number, updates: Partial<Route>): Route | null {
  const routes = loadRoutes();
  const index = routes.findIndex((r) => r.id === id);
  if (index === -1) return null;
  routes[index] = { ...routes[index], ...updates };
  saveRoutes(routes);
  return toRoute(routes[index]);
}

export function deleteRoute(id: number): boolean {
  const routes = loadRoutes();
  const index = routes.findIndex((r) => r.id === id);
  if (index === -1) return false;
  routes.splice(index, 1);
  saveRoutes(routes);
  return true;
}
