// src/mocks/seed.ts
import { db } from './db';
// Import your data generation functions (e.g., from your old mock files)

export async function seedDatabase() {
  const jobCount = await db.jobs.count();
  // Only seed if the database is empty
  if (jobCount === 0) {
    console.log("Seeding database...");
    await db.jobs.bulkAdd([
      // ... generate your 25 jobs here
    ]);
    await db.candidates.bulkAdd([
      // ... generate your 1000 candidates here
    ]);
    // ... seed assessments
    console.log("Database seeded successfully.");
  }
}