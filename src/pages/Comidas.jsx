import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CardsFood from '../components/CardsFood';
import ButtonCategoriesFood from '../components/ButtonCategoriesFood';

function Comidas() {
  return (
    <div>
      <Header name="Comidas" button />
      <ButtonCategoriesFood />
      <CardsFood />
      <Footer />
    </div>
  );
}

export default Comidas;
