import { Route } from "@/types";
import prisma from "@/lib/prisma";

export async function getRoutesList(): Promise<Route[]> {
  const routes = await prisma.route.findMany({
    orderBy: { createdAt: "desc" },
  });
  return routes as Route[];
}

export async function getRouteById(id: string): Promise<Route | null> {
  const route = await prisma.route.findUnique({
    where: { id: Number(id) },
  });
  return route as Route | null;
}
