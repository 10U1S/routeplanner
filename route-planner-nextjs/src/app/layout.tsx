import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Route Planner",
  description: "Entdecke neue Routen und plane deine nächste Tour",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
        {/* Modern Header with glass effect */}
        <header className="sticky top-0 z-50 glass border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors"
              >
                <span className="text-2xl">🗺️</span>
                <span>Route Planner</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-1">
                {[
                  { href: "/", label: "Start", icon: "🏠" },
                  { href: "/routen", label: "Routen", icon: "🥾" },
                  { href: "/favoriten", label: "Favoriten", icon: "⭐" },
                  { href: "/about", label: "Über uns", icon: "ℹ️" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50/50 group"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                  </Link>
                ))}
              </nav>

              {/* Mobile menu button */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          {children}
        </main>
        
        {/* Modern Footer */}
        <footer className="relative mt-20 border-t border-gray-200/60 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-800">
                  <span className="text-xl">🗺️</span>
                  Route Planner
                </Link>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Entdecke neue Routen und plane deine nächste Tour. 
                  Durchsuche unsere Sammlung von Wander-, Rad-, Lauf- und Kletterrouten.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Links</h3>
                <ul className="space-y-2">
                  {[
                    { href: "/", label: "Startseite" },
                    { href: "/routen", label: "Alle Routen" },
                    { href: "/about", label: "Über uns" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href} 
                        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Kategorien</h3>
                <div className="flex flex-wrap gap-2">
                  {["Wandern", "Radfahren", "Laufen", "Klettern"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/routen?category=${cat}`}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200/60 text-center">
              <p className="text-sm text-gray-400">
                Route Planner Projekt — Praktikum 8: Datenbankintegration mit Prisma & SQLite
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
