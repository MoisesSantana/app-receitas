import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestApiDrinkSurprise } from '../services/requestDrink';
import '../styles/pages/explorar.css';

function ExplorarBebidas() {
  const [drinkSurpriseId, setDrinkSurpriseId] = useState('');

  useEffect(() => {
    const handleSurpriseEndpoint = async () => {
      const endpoint = await requestApiDrinkSurprise();
      setDrinkSurpriseId(endpoint[0].idDrink);
    };

    handleSurpriseEndpoint();
  }, []);

  if (!drinkSurpriseId) return <span>Loading...</span>;

  return (
    <div>
      <Header name="Explorar Bebidas" button={ false } />
      <div className="container-btn-explorar">
        <Link to="/explorar/bebidas/ingredientes">
          <button
            data-testid="explore-by-ingredient"
            className="btn-explorar"
            type="button"
          >
            Por Ingredientes
          </button>
        </Link>
        <Link
          to={ `/bebidas/${drinkSurpriseId}` }
        >
          <button
            className="btn-explorar"
            data-testid="explore-surprise"
            type="button"
          >
            Me Surpreenda!
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default ExplorarBebidas;
