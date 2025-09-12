import { Link } from 'react-router-dom';

const Nav = () => {

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

        <nav className="navbarContainer">

            <div className="nabvarBrand">Space Restaurant</div>

            <ul clasName="navbarMenu">

                {navTabs.map((tab, index) => (

                    <li key={index} className="navbar-item">
                        <Link className="navbar-link" to={tab.redirection}> 
                            <span className="navbar-text">{tab.text}</span>
                        </Link>
                    </li>   

                ))};

            </ul>

        </nav>

    );

};

export default Nav;