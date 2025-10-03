// Estilos
import './globals.css';

// Rutas
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Notificaciones
import { ToastContainer } from "react-toastify";

// Layout
import Layout from './Layout.jsx';

// Paginas
import Home from './pages/Home/Home.jsx';

// Provedor del usuario
import { UserProvider } from './contexts/UserContext.jsx';

function App() {
  return (
    <Router>
      <UserProvider>
        <ToastContainer
          position="top-left"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          limit={3}
          pauseOnFocusLoss
          pauseOnHover />
        <Routes>
          
          {/* Rutas del Cliente */}
          <Route path="/" element={<Layout />}>

            <Route index element={<Home />} />
            
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;