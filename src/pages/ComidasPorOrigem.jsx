import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  requestApiFoodFilterName,
  requestApiFoodFilterArea,
  requestApiFoodListArea,
} from '../services/requestFood';
import CoffeAndCodeContext from '../context/CoffeeAndCodeContext';
import '../styles/pages/origem.css';

function ComidasPorOrigem() {
  const maxCardAmount = 12;
  const firstCard = 0;
  const [cardAmount, setCardAmount] = useState(maxCardAmount);
  const [areaList, setAreaList] = useState(['All']);
  const { cardFood, setCardFood } = useContext(CoffeAndCodeContext);

  const noFilterForCardFood = async () => {
    const requestInitialCardFood = await requestApiFoodFilterName();
    setCardFood(requestInitialCardFood);
  };

  const filterCardFood = async ({ target: { value } }) => {
    if (value === 'All') noFilterForCardFood();
    else {
      const apiResult = await requestApiFoodFilterArea(value);
      setCardFood(apiResult);
    }
  };

  const callInitialApis = async () => {
    noFilterForCardFood();
    const requestAreaList = await requestApiFoodListArea();
    const expectedAreaList = requestAreaList
      .map(({ strArea }) => strArea);
    setAreaList([...areaList, ...expectedAreaList]);
  };

  useEffect(() => {
    callInitialApis();
  }, []);

  if (!areaList || !cardFood) return <span>Loading...</span>;

  return (
    <div className="main-origin-container">
      <Header name="Explorar Origem" button />
      <select
        className="drop-down"
        data-testid="explore-by-area-dropdown"
        onChange={ filterCardFood }
      >
        {
          areaList.map((area) => (
            <option
              className="drop-down-content"
              key={ area }
              data-testid={ `${area}-option` }
            >
              { area }
            </option>
          ))
        }
      </select>
      <div className="holder-origin">
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
                        className="image"
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
      </div>
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
      <Footer />
    </div>
  );
}

export default ComidasPorOrigem;
