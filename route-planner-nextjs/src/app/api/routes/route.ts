import { NextResponse } from "next/server";
import { Difficulty, RouteCategory } from "@/types";
import { getRoutes, addRoute } from "@/lib/routes-data";

// GET /api/routes — gibt die gesamte Liste zurück
export async function GET() {
  const routes = getRoutes();
  return NextResponse.json(routes);
}

// POST /api/routes — fügt eine neue Route hinzu
export async function POST(request: Request) {
  const body = await request.json();
  const { name, distance, duration, difficulty, category, description } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "name ist erforderlich" }, { status: 400 });
  }
  if (distance === undefined || typeof distance !== "number") {
    return NextResponse.json({ error: "distance ist erforderlich" }, { status: 400 });
  }
  if (duration === undefined || typeof duration !== "number") {
    return NextResponse.json({ error: "duration ist erforderlich" }, { status: 400 });
  }
  if (!difficulty || !["leicht", "mittel", "schwer"].includes(difficulty)) {
    return NextResponse.json({ error: "difficulty muss 'leicht', 'mittel' oder 'schwer' sein" }, { status: 400 });
  }
  if (!category || !["Wandern", "Radfahren", "Laufen", "Klettern"].includes(category)) {
    return NextResponse.json({ error: "category muss 'Wandern', 'Radfahren', 'Laufen' oder 'Klettern' sein" }, { status: 400 });
  }

  const newRoute = addRoute({
    name,
    distance,
    duration,
    difficulty: difficulty as Difficulty,
    category: category as RouteCategory,
    description: description || "",
  });

  return NextResponse.json(newRoute, { status: 201 });
}
