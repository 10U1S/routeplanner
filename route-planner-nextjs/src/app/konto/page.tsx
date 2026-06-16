import { getRoutes } from "@/app/actions";
import KontoClient from "@/components/KontoClient";

export const metadata = {
  title: "Konto – Route Planner",
  description: "Dein persönliches Profil und deine Abzeichen",
};

export default async function KontoPage() {
  const routes = await getRoutes();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/40 to-pink-50/20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Mein Konto</h1>
          <p className="text-gray-500 mt-1">Profil, Hobbys und absolvierte Routen</p>
        </div>
        <KontoClient allRoutes={routes} />
      </div>
    </main>
  );
}
