import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CoffeeAndCodeContext from '../context/CoffeeAndCodeContext';
import { requestApiFoodFilterName } from '../services/requestFood';
import '../styles/components/cards.css';

function CardsFood() {
  const maxCardAmount = 12;
  const firstCard = 0;
  const [cardAmount, setCardAmount] = useState(maxCardAmount);

  const { cardFood, setCardFood } = useContext(CoffeeAndCodeContext);

  const callApi = async () => {
    const apiResult = await requestApiFoodFilterName();
    setCardFood(apiResult);
  };

  useEffect(() => {
    if (!cardFood.length) callApi();
  }, []);

  if (!cardFood.length) return <span>Loading...</span>;
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
  return (
    <div className="container">
      {
        cardFood.slice(firstCard, cardAmount)
          .map((currentObject, index) => {
            const {
              idMeal,
              strMeal,
              strMealThumb,
            } = currentObject;

            return (
              <div
                className="holder"
                key={ idMeal }
                data-testid={ `${index}-recipe-card` }
              >
                <Link to={ `/comidas/${idMeal}` } className="image-link">
                  <div className="image-container">
                    <img
                      src={ strMealThumb }
                      alt={ strMeal }
                      data-testid={ `${index}-card-img` }
                    />
                  </div>
                </Link>
                <div className="subtitle-container">
                  <Link to={ `/comidas/${idMeal}` } className="subtitle-link">
                    <h4 data-testid={ `${index}-card-name` }>{ strMeal }</h4>
                  </Link>
                </div>
              </div>
            );
          })
      }
      <div className="container-btn">
        <button
          className="see-more"
          type="button"
          onClick={ () => setCardAmount(cardAmount + maxCardAmount) }
          disabled={ cardFood.length < cardAmount }
        >
          See More
        </button>
      </div>
    </div>
  );
}

export default CardsFood;
