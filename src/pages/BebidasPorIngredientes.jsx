import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CoffeAndCodeContext from '../context/CoffeeAndCodeContext';
import {
  requestApiDrinkFilterIngredient,
  requestApiDrinkListIngredients,
} from '../services/requestDrink';
import '../styles/pages/ingredientes.css';

function BebidasPorIngredients() {
  const maxCardAmount = 12;
  const firstCard = 0;
  const [cardAmount, setCardAmount] = useState(maxCardAmount);
  const [ingredientList, setIngredientList] = useState([]);
  const [toDrinks, setToDrinks] = useState(false);
  const { setCardDrink } = useContext(CoffeAndCodeContext);

  const redirectToMainRecipePage = async (strIngredient) => {
    const apiResult = await requestApiDrinkFilterIngredient(strIngredient);
    setCardDrink(apiResult);
    setToDrinks(true);
  };

  const callApi = async () => {
    const apiResult = await requestApiDrinkListIngredients();
    setIngredientList(apiResult);
  };

  useEffect(() => {
    callApi();
  }, []);

  if (!ingredientList) return <span>Loading...</span>;
  if (toDrinks) return <Redirect to="/bebidas" />;

  return (
    <div className="main-ingredient-container">
      <Header name="Explorar Ingredientes" button={ false } />
      <div className="holder-ingredients">
        {
          ingredientList.slice(firstCard, cardAmount)
            .map(({ strIngredient1 }, index) => (
              <button
                className="ingredient-btn"
                type="button"
                key={ strIngredient1 }
                data-testid={ `${index}-ingredient-card` }
                onClick={ () => redirectToMainRecipePage(strIngredient1) }
              >
                <img
                  src={ `https://www.thecocktaildb.com/images/ingredients/${strIngredient1}-Small.png` }
                  alt={ strIngredient1 }
                  data-testid={ `${index}-card-img` }
                />
                <p
                  className="ingredient-name"
                  data-testid={ `${index}-card-name` }
                >
                  { strIngredient1 }
                </p>
              </button>
            ))
        }
      </div>
      <div className="container-btn">
        <button
          className="see-more"
          type="button"
          onClick={ () => setCardAmount(cardAmount + maxCardAmount) }
          disabled={ ingredientList.length < cardAmount }
        >
          See More
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default BebidasPorIngredients;
