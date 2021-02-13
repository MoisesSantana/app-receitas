import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/explorar.css';

function Explorar() {
  return (
    <div>
      <Header name="Explorar" button={ false } />
      <div className="container-btn-explorar">
        <Link
          to="/explorar/comidas"
        >
          <button
            className="btn-explorar"
            data-testid="explore-food"
            type="button"
          >
            Explorar Comidas
          </button>
        </Link>

        <Link
          to="/explorar/bebidas"
        >
          <button
            className="btn-explorar"
            data-testid="explore-drinks"
            type="button"
          >
            Explorar Bebidas
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default Explorar;
