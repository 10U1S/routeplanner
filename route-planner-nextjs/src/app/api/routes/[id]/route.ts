import { NextResponse } from "next/server";
import { getRoute, updateRoute, deleteRoute } from "@/lib/routes-data";

// GET /api/routes/:id — gibt eine einzelne Route zurück
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const route = getRoute(id);

  if (!route) {
    return NextResponse.json({ error: "Route nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json(route);
}

// PUT /api/routes/:id — aktualisiert eine Route
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const routeId = Number(id);

  if (isNaN(routeId)) {
    return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
  }

  const body = await request.json();
  const { name, distance, duration, difficulty, category, description } = body;

  if (name !== undefined && typeof name !== "string") {
    return NextResponse.json({ error: "name muss ein String sein" }, { status: 400 });
  }
  if (distance !== undefined && typeof distance !== "number") {
    return NextResponse.json({ error: "distance muss eine Zahl sein" }, { status: 400 });
  }
  if (duration !== undefined && typeof duration !== "number") {
    return NextResponse.json({ error: "duration muss eine Zahl sein" }, { status: 400 });
  }
  if (difficulty !== undefined && !["leicht", "mittel", "schwer"].includes(difficulty)) {
    return NextResponse.json({ error: "difficulty muss 'leicht', 'mittel' oder 'schwer' sein" }, { status: 400 });
  }
  if (category !== undefined && !["Wandern", "Radfahren", "Laufen", "Klettern"].includes(category)) {
    return NextResponse.json({ error: "category muss 'Wandern', 'Radfahren', 'Laufen' oder 'Klettern' sein" }, { status: 400 });
  }

  const updated = updateRoute(routeId, {
    name,
    distance,
    duration,
    difficulty,
    category,
    description,
  });

  if (!updated) {
    return NextResponse.json({ error: "Route nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE /api/routes/:id — löscht eine Route
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const routeId = Number(id);

  if (isNaN(routeId)) {
    return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
  }

  const success = deleteRoute(routeId);

  if (!success) {
    return NextResponse.json({ error: "Route nicht gefunden" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
