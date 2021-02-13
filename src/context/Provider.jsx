import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CoffeAndCodeContext from './CoffeeAndCodeContext';

function Provider({ children }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cardFood, setCardFood] = useState([]);
  const [cardDrink, setCardDrink] = useState([]);
  const [drinkDetails, setDrinkDetails] = useState([]);
  const [foodDetails, setFoodDetails] = useState([]);
  const [copyVisibility, setCopyVisibility] = useState('hidden');

  const [categoriesButtonDrink, setCategoriesButtonDrink] = useState([]);
  const [categoriesButtonFood, setCategoriesButtonFood] = useState([]);
  const [ingredientsAndMeasures, setIngredientsAndMeasures] = useState([]);

  const contextValue = {
    email,
    setEmail,
    password,
    setPassword,
    setCardFood,
    setCardDrink,
    cardFood,
    cardDrink,
    drinkDetails,
    setDrinkDetails,
    categoriesButtonDrink,
    categoriesButtonFood,
    setCategoriesButtonDrink,
    setCategoriesButtonFood,
    ingredientsAndMeasures,
    setIngredientsAndMeasures,
    foodDetails,
    setFoodDetails,
    copyVisibility,
    setCopyVisibility,
  };

  return (
    <CoffeAndCodeContext.Provider value={ contextValue }>
      { children }
    </CoffeAndCodeContext.Provider>
  );
}

Provider.propTypes = { children: PropTypes.node.isRequired };

export default Provider;
