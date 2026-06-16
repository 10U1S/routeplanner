import Link from "next/link";

export default function HomePage() {
  const categories = [
    { 
      href: "/routen?category=Wandern", 
      icon: "🥾", 
      title: "Wandern", 
      desc: "Entspannte Touren durch die Natur",
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    { 
      href: "/routen?category=Radfahren", 
      icon: "🚴", 
      title: "Radfahren", 
      desc: "Rasant auf zwei Rädern",
      color: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    { 
      href: "/routen?category=Laufen", 
      icon: "🏃", 
      title: "Laufen", 
      desc: "Joggingstrecken für jedes Level",
      color: "from-orange-500 to-amber-600",
      bg: "bg-orange-50",
      border: "border-orange-100"
    },
    { 
      href: "/routen?category=Klettern", 
      icon: "🧗", 
      title: "Klettern", 
      desc: "Höhenluft schnuppern",
      color: "from-purple-500 to-pink-600",
      bg: "bg-purple-50",
      border: "border-purple-100"
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent dark:from-indigo-500/20" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 text-sm font-medium text-indigo-700 mb-6 shadow-sm dark:border-indigo-400/20 dark:bg-slate-900/80 dark:text-indigo-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
              Entdecke deine nächste Tour
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight dark:text-slate-50">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Route Planner
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed dark:text-slate-300">
              Entdecke neue Routen und plane deine nächste Tour. 
              Durchsuche unsere Sammlung von Wander-, Rad-, Lauf- und Kletterrouten.
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((category, index) => (
              <Link
                key={category.href}
                href={category.href}
                className={`group relative ${category.bg} ${category.border} border-2 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up opacity-0 stagger-${index + 1} dark:border-slate-700 dark:bg-slate-900/80`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`} />
                
                <div className="relative">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors dark:text-slate-100 dark:group-hover:text-indigo-300">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed dark:text-slate-400">
                    {category.desc}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Entdecken</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 animate-fade-in-up dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-slate-950/40">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 dark:text-slate-100">
              Bereit für dein nächstes Abenteuer?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto dark:text-slate-300">
              Durchstöbere alle verfügbaren Routen und finde die perfekte Tour für dich.
            </p>
            <Link
              href="/routen"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              <span>Alle Routen anzeigen</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
