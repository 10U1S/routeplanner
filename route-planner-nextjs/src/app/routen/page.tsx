import { Suspense } from "react";
import { getRoutes } from "@/app/actions";
import RoutesClient from "@/components/RoutesClient";

export default async function RoutesPage() {
  const routes = await getRoutes();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Alle Routen</h1>
        <Suspense fallback={<p className="text-gray-500">Routen werden geladen...</p>}>
          <RoutesClient initialRoutes={routes} />
        </Suspense>
      </div>
    </main>
  );
}
