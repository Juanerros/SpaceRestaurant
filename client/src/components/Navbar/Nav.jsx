import { Link } from 'react-router-dom';
import './nav.css';
import { useState, useEffect } from 'react';

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navTabs = [
    {
      text: "Inicio",
      redirection: "/",
    },
    {
      text: "Menú",
      redirection: "/menu",
    },
    {
      text: "Reservas",
      redirection: "/reservas",
    },
    {
      text: "Informacion",
      redirection: "/informacion",
    }
  ];

  return (
    <nav className={`navbarContainer ${scrolled ? 'scrolled' : ''}`}>
      {/* Menú a la izquierda */}
      <div className="navbarMenu-left">
        <ul className="navbarMenu">
          {navTabs.map((tab, index) => (
            <li key={index} className="navbar-item">
              <Link 
                className="navbar-link" 
                to={tab.redirection}
              >
                <span className="navbar-text">{tab.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logo centrado */}
      <div className="navbarLogo">
        <img 
          src="/assets/restaurant_space_logo.png" 
          alt="Space Restaurant Logo" 
          className="logo-img"
        />
      </div>

      {/* Botón a la derecha */}
      <Link className="buttonReser" to="/reservas">
        <span>Reservar</span>
      </Link>

      {/* Menú móvil (se mostrará solo en pantallas pequeñas) */}
      <button 
        className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-label="Menú principal"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <div className={`navbarMenuContainer ${menuOpen ? 'open' : ''}`}>
        <ul className="navbarMenu-mobile">
          <div className="nabvarBrand">Space Restaurant</div>
          {navTabs.map((tab, index) => (
            <li key={index} className="navbar-item">
              <Link 
                className="navbar-link" 
                to={tab.redirection}
                onClick={() => setMenuOpen(false)}
              >
                <span className="navbar-text">{tab.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;