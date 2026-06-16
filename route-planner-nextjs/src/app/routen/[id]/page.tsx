import { getRoute } from "@/app/actions";
import Link from "next/link";

export default async function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const route = await getRoute(Number(id));

  if (!route) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4 dark:text-slate-100">Route nicht gefunden</h1>
          <p className="text-gray-500 mb-8 dark:text-slate-400">Die angeforderte Route existiert nicht.</p>
          <Link
            href="/routen"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors"
          >
            ← Zurück zur Übersicht
          </Link>
        </div>
      </main>
    );
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "leicht":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "mittel":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "schwer":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Wandern":
        return "🥾";
      case "Radfahren":
        return "🚴";
      case "Laufen":
        return "🏃";
      case "Klettern":
        return "🧗";
      default:
        return "📍";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/routen"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 transition-colors group dark:text-slate-400 dark:hover:text-slate-100"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Zurück zur Übersicht</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/40">
          {/* Header with gradient accent */}
          <div className="h-2 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400" />
          
          <div className="p-8 sm:p-10">
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl dark:border-slate-700 dark:bg-slate-800">
                  {getCategoryIcon(route.category)}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-slate-100">
                    {route.name}
                  </h1>
                  <p className="text-gray-400 mt-1 font-medium dark:text-slate-500">
                    {route.category} Tour
                  </p>
                </div>
              </div>
              
              <span className={`self-start px-4 py-2 rounded-full text-sm font-semibold border ${getDifficultyBadge(route.difficulty)}`}>
                {route.difficulty}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100 dark:border-slate-700 dark:bg-slate-800">
                <div className="text-2xl mb-2">📏</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-slate-100">{route.distance}</div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1 dark:text-slate-500">Kilometer</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100 dark:border-slate-700 dark:bg-slate-800">
                <div className="text-2xl mb-2">⏱️</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-slate-100">{route.duration}</div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1 dark:text-slate-500">Minuten</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100 dark:border-slate-700 dark:bg-slate-800">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-lg font-bold text-gray-800 dark:text-slate-100">{route.category}</div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1 dark:text-slate-500">Kategorie</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider dark:text-slate-200">
                <span>📝</span>
                <span>Beschreibung</span>
              </h3>
              <p className="text-gray-600 leading-relaxed dark:text-slate-300">
                {route.description || "Keine Beschreibung verfügbar."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-gray-800 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 dark:bg-indigo-600 dark:hover:bg-indigo-700">
                <span>🗺️</span>
                <span>Route planen</span>
              </button>
              <button className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                ⭐ Speichern
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-slate-500">
            Erstellt am {new Date(route.createdAt).toLocaleDateString("de-DE")}
            {route.updatedAt !== route.createdAt && (
              <span> · Zuletzt aktualisiert am {new Date(route.updatedAt).toLocaleDateString("de-DE")}</span>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
