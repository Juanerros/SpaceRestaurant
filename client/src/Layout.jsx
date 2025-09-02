import './globals.css';
// Componentes

// Dependencias
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from 'react';

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {
      /*
      
      Aca se renderiza los componentes principales
      
      <header>
        <Nav />
      </header>
      <main>
        <Outlet />
      </main>
      <Footer /> */}
    </>
  );
};

export default Layout;