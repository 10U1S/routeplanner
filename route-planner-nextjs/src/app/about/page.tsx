export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-950 dark:to-indigo-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 dark:text-slate-100">Über uns</h1>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-6 dark:border dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/40">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 dark:text-slate-100">
              Route Planner - Dein Begleiter für Outdoor-Abenteuer
            </h2>
            <p className="text-gray-600 leading-relaxed dark:text-slate-300">
              Wir sind ein leidenschaftliches Team von Outdoor-Enthusiasten, die es sich zur Aufgabe gemacht haben,
              Wanderern, Radfahrern, Läufern und Kletterern die besten Routen in ihrer Region zu zeigen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 dark:text-slate-100">Unsere Mission</h2>
            <p className="text-gray-600 leading-relaxed dark:text-slate-300">
              Jeder sollte die Möglichkeit haben, die Natur zu entdecken – unabhängig von Erfahrungslevel oder
              Fitness. Deshalb bieten wir eine vielfältige Auswahl an Routen für alle Schwierigkeitsgrade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 dark:text-slate-100">Technologie</h2>
            <p className="text-gray-600 leading-relaxed dark:text-slate-300">
              Diese Anwendung wurde im Rahmen des Praktikums &quot;Multimediaapplikationen&quot; entwickelt.
              Sie basiert auf Next.js mit Server-Side Rendering und TypeScript.
            </p>
          </section>

          <div className="pt-4 border-t dark:border-slate-700">
            <p className="text-gray-500 text-sm dark:text-slate-400">
              © 2026 Route Planner. Erstellt mit ❤️ für alle Outdoor-Fans.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
