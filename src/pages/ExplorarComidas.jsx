import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestApiMealSurprise } from '../services/requestFood';
import '../styles/pages/explorar.css';

function ExplorarComidas() {
  const [mealSurpriseId, setMealSurpriseId] = useState('');

  useEffect(() => {
    const handleSurpriseEndpoint = async () => {
      const endpoint = await requestApiMealSurprise();
      setMealSurpriseId(endpoint[0].idMeal);
    };

    handleSurpriseEndpoint();
  }, []);

  if (!mealSurpriseId) return <span>Loading...</span>;

  return (
    <div>
      <Header name="Explorar Comidas" button={ false } />
      <div className="container-btn-explorar">
        <Link to="/explorar/comidas/ingredientes">
          <button
            data-testid="explore-by-ingredient"
            type="button"
            className="btn-explorar"
          >
            Por Ingredientes
          </button>
        </Link>
        <Link to="/explorar/comidas/area">
          <button
            className="btn-explorar"
            data-testid="explore-by-area"
            type="button"
          >
            Por Local de Origem
          </button>
        </Link>
        <Link
          to={ `/comidas/${mealSurpriseId}` }
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

export default ExplorarComidas;
