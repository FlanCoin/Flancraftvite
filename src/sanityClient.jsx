// src/sanityClient.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,  // ID de tu proyecto Sanity
  dataset: 'production',                             // Dataset por defecto
  useCdn: true,                                       // Usa CDN si no necesitas datos en tiempo real
  apiVersion: '2023-01-01',                           // Versión estable de la API
  token: import.meta.env.VITE_SANITY_TOKEN,           // Token secreto desde .env
});

export default client;
