import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CardsDrink from '../components/CardsDrink';
import ButtonCategoriesDrink from '../components/ButtonCategoriesDrink';

function Bebidas() {
  return (
    <div>
      <Header name="Bebidas" button />
      <ButtonCategoriesDrink />
      <CardsDrink />
      <Footer />
    </div>
  );
}

export default Bebidas;
