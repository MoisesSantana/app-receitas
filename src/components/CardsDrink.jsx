import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CoffeeAndCodeContext from '../context/CoffeeAndCodeContext';
import { requestApiDrinkFilterName } from '../services/requestDrink';
import '../styles/components/cards.css';

function CardsDrink() {
  const maxCardAmount = 12;
  const firstCard = 0;
  const [cardAmount, setCardAmount] = useState(maxCardAmount);

  const { cardDrink, setCardDrink } = useContext(CoffeeAndCodeContext);

  const callApi = async () => {
    const apiResult = await requestApiDrinkFilterName();
    setCardDrink(apiResult);
  };

  useEffect(() => {
    if (!cardDrink.length) callApi();
  }, []);

  if (!cardDrink.length) return <span>Loading...</span>;
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
  return (
    <div className="container">
      {
        cardDrink.slice(firstCard, cardAmount)
          .map((currentObject, index) => {
            const {
              idDrink,
              strDrink,
              strDrinkThumb,
            } = currentObject;

            return (
              <div
                className="holder"
                key={ idDrink }
                data-testid={ `${index}-recipe-card` }
              >
                <Link to={ `/bebidas/${idDrink}` } className="image-link">
                  <div className="image-container">
                    <img
                      src={ strDrinkThumb }
                      alt={ strDrink }
                      data-testid={ `${index}-card-img` }
                    />
                  </div>
                </Link>
                <div className="subtitle-container">
                  <Link to={ `/bebidas/${idDrink}` } className="subtitle-link">
                    <h4 data-testid={ `${index}-card-name` }>{ strDrink }</h4>
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
          disabled={ cardDrink.length < cardAmount }
        >
          See More
        </button>
      </div>
    </div>
  );
}

export default CardsDrink;
