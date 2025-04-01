// src/context/SectionContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const SectionContext = createContext();

// Proveedor del contexto para las secciones
export const SectionProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('flancraft');

  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </SectionContext.Provider>
  );
};
