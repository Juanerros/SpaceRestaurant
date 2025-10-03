import { Outlet } from "react-router-dom";
import Nav from './components/Navbar/Nav';
import './globals.css';
// Componentes

// Dependencias
const Layout = () => {

  return (
    <>
      <header>
        
        <Nav />

      </header>

      <div>

        <Outlet />

      </div>
      
    </>
  );

};

export default Layout;