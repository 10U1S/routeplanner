import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Bestehende Daten löschen
  await prisma.route.deleteMany();

  // Testdaten einfügen
  await prisma.route.createMany({
    data: [
      {
        name: "Waldweg Runde",
        distance: 5.2,
        duration: 75,
        difficulty: "leicht",
        category: "Wandern",
        description: "Schöne Runde durch den Wald mit flachen Wegen.",
      },
      {
        name: "Bergauf Challenge",
        distance: 8.7,
        duration: 120,
        difficulty: "schwer",
        category: "Wandern",
        description: "Anspruchsvolle Tour mit steilen Anstiegen.",
      },
      {
        name: "Flussufer Weg",
        distance: 3.5,
        duration: 50,
        difficulty: "leicht",
        category: "Laufen",
        description: "Entspannter Spaziergang entlang des Flusses.",
      },
      {
        name: "Alpenüberquerung",
        distance: 25.0,
        duration: 480,
        difficulty: "schwer",
        category: "Wandern",
        description: "Mehrtägige Tour über die Alpen mit atemberaubenden Ausblicken.",
      },
      {
        name: "Stadtradtour",
        distance: 12.5,
        duration: 90,
        difficulty: "mittel",
        category: "Radfahren",
        description: "Gemütliche Radtour durch die Innenstadt mit vielen Sehenswürdigkeiten.",
      },
      {
        name: "Klettersteig",
        distance: 3.0,
        duration: 180,
        difficulty: "schwer",
        category: "Klettern",
        description: "Herausfordernder Klettersteig mit gesicherten Passagen.",
      },
    ],
  });

  console.log("Seed-Daten erstellt!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
