import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

/**
 * Enables API mocking in development.
 * This function will do nothing in production.
 */
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  // Corrected paths to point to your src/data/database/ folder
  const { worker } = await import('./data/database/browser');
  const { seedDatabase } = await import('./data/database/seed');

  // Seed the IndexedDB with initial data if it's empty
  await seedDatabase();
  
  // Start the MSW worker to begin intercepting network requests
  return worker.start();
}

// Ensure mocking is enabled before rendering the app
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});