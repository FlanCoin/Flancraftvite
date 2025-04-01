import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Mueve el scroll directamente a la parte superior sin animación
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto', // Sin animación, es inmediato
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
