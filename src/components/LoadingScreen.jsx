import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';
import loadingImage from '../assets/loading.gif'; // Asegúrate de que la imagen exista y sea accesible

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Añadir la clase al body para desactivar el scroll en la pantalla de carga
    document.body.classList.add('loading-active');

    // Función para manejar la carga completa de la página
    const handleLoad = () => {
      setIsLoading(false);
      document.body.classList.remove('loading-active');
    };

    // Verifica si el documento ya está listo y completamente cargado
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad); // Detectar cuando se completa la carga
    }

    return () => {
      document.body.classList.remove('loading-active'); // Asegúrate de quitar la clase en desmontaje
      window.removeEventListener('load', handleLoad); // Eliminar el evento de carga para evitar fugas de memoria
    };
  }, []);

  // Si la página ya está cargada, oculta la pantalla de carga
  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <img src={loadingImage} alt="Cargando..." className="loading-image" />
        <h1 className="loading-text">Cargando...</h1>
      </div>
    </div>
  );
};

export default LoadingScreen;
