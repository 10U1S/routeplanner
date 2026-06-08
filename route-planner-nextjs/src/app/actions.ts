"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export type Route = {
  id: number;
  name: string;
  distance: number;
  duration: number;
  difficulty: "leicht" | "mittel" | "schwer";
  category: "Wandern" | "Radfahren" | "Laufen" | "Klettern";
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getRoutes(): Promise<Route[]> {
  const routes = await prisma.route.findMany({
    orderBy: { createdAt: "desc" },
  });
  return routes as Route[];
}

export async function getRoute(id: number): Promise<Route | null> {
  const route = await prisma.route.findUnique({
    where: { id },
  });
  return route as Route | null;
}

export async function createRoute(data: {
  name: string;
  distance: number;
  duration: number;
  difficulty: "leicht" | "mittel" | "schwer";
  category: "Wandern" | "Radfahren" | "Laufen" | "Klettern";
  description: string;
}): Promise<Route> {
  const route = await prisma.route.create({
    data,
  });
  revalidatePath("/");
  return route as Route;
}

export async function updateRoute(
  id: number,
  data: {
    name?: string;
    distance?: number;
    duration?: number;
    difficulty?: "leicht" | "mittel" | "schwer";
    category?: "Wandern" | "Radfahren" | "Laufen" | "Klettern";
    description?: string;
  }
): Promise<Route> {
  const route = await prisma.route.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  return route as Route;
}

export async function deleteRoute(id: number): Promise<void> {
  await prisma.route.delete({
    where: { id },
  });
  revalidatePath("/");
}
