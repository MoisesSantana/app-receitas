import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/components/footer.css';
import shareIcon from '../images/shareIcon.svg';
import FavoriteHeart from '../components/FavoriteHeart';
import CoffeAndCodeContext from '../context/CoffeeAndCodeContext';
import { requestApiDrinkDetails } from '../services/requestDrink';
import { recommendFoodsList } from '../services/requestFood';
import { loadState } from '../services/localStorage';
import '../styles/pages/detalhes.css';

// https://github.com/tryber/sd-07-project-recipes-app/blob/main-group-23;
// slick-carrousel;

const filterIngredientsAndMeasures = (
  detailsEntries,
  filteredMeasures,
  filteredIngredients,
) => {
  const ingredientRegex = /strIngredient/i;
  const measureRegex = /strMeasure/i;

  detailsEntries.forEach((currentArray) => {
    if (ingredientRegex.test(currentArray[0]) && currentArray[1] !== null) {
      filteredIngredients.push(currentArray[1]);
    }
    if (measureRegex.test(currentArray[0]) && currentArray[1] !== null) {
      filteredMeasures.push(currentArray[1]);
    }
  });
};

const getExpectedArray = (filteredIngredients, filteredMeasures) => (
  filteredIngredients.map((ingredient, index) => (
    `${ingredient} ${
      filteredMeasures[index] ? filteredMeasures[index] : ''
    }`
  ))
);

function DetalhesBebidas({ match: { params: { id } } }) {
  const [recommendedForThisDrink, setRecommendedForThisDrink] = useState([]);
  const [startRecipeButton, setStartRecipeButton] = useState('Iniciar Receita');
  const [startButtonVisibility, setStartButtonVisibility] = useState({});

  const {
    drinkDetails,
    setDrinkDetails,
    ingredientsAndMeasures,
    setIngredientsAndMeasures,
    copyVisibility,
    setCopyVisibility,
  } = useContext(CoffeAndCodeContext);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
  };

  const getIngredientsAndMeasures = () => {
    const detailsEntries = Object.entries(drinkDetails);
    const filteredIngredients = [];
    const filteredMeasures = [];

    filterIngredientsAndMeasures(detailsEntries, filteredMeasures, filteredIngredients);
    const expectedArray = getExpectedArray(filteredIngredients, filteredMeasures);
    setIngredientsAndMeasures(expectedArray);
  };

  const getTheRecommendedFood = async () => {
    if (drinkDetails) {
      const firstIndex = 0;
      const lastIndex = 6;
      const recommendedDrinksArray = await recommendFoodsList();
      const expectedArray = recommendedDrinksArray.meals.slice(firstIndex, lastIndex);
      setRecommendedForThisDrink(expectedArray);
    }
  };

  const setStateOfStartRecipe = () => {
    if (localStorage.getItem('inProgressRecipes')) {
      const loadStorage = loadState('inProgressRecipes', '');
      if (loadStorage.cocktails && loadStorage.cocktails[id]) {
        setStartRecipeButton('Continuar Receita');
      }
    }
  };

  const testRecipeDone = () => {
    const loadStorage = loadState('doneRecipes', []);
    const expectedArray = loadStorage.filter((doneRecipe) => doneRecipe.id === id);

    if (expectedArray.length) setStartButtonVisibility({ visibility: 'hidden' });
    else setStartButtonVisibility({ visibility: 'visible' });
  };

  useEffect(() => {
    getIngredientsAndMeasures();
    getTheRecommendedFood();
    setStateOfStartRecipe();
    testRecipeDone();
  }, [drinkDetails]);

  const callMainApi = async () => {
    const apiResult = await requestApiDrinkDetails(id);
    setDrinkDetails(apiResult[0]);
  };

  useEffect(() => {
    callMainApi();
  }, []);

  const showMessage = () => {
    setCopyVisibility('visible');
    setTimeout(() => {
      setCopyVisibility('hidden');
    }, 3000);
  };

  if (!drinkDetails) return <span>Loading...</span>;

  return (
    <div className="details-container">
      <img
        className="image-recipe"
        src={ drinkDetails.strDrinkThumb }
        alt={ drinkDetails.strDrink }
        data-testid="recipe-photo"
      />
      <h1 data-testid="recipe-title" className="title">
        { drinkDetails.strDrink }
      </h1>
      <h3 data-testid="recipe-category" className="category">
        <span>{ drinkDetails.strAlcoholic }</span>
        <br />
        <span>{ drinkDetails.strCategory }</span>
      </h3>
      <div className="copy-and-favorite">
        <CopyToClipboard text={ window.location.href }>
          <button
            type="button"
            data-testid="share-btn"
            onClick={ showMessage }
          >
            <img src={ shareIcon } alt="Share icon" />
          </button>
        </CopyToClipboard>
        <FavoriteHeart id={ id } drink />
        <small
          style={ { visibility: copyVisibility } }
        >
          <p>Link copiado!</p>
        </small>
      </div>
      <div className="ingredient-container">
        <p className="title">Ingredients</p>
        <ul className="ingredients">
          {
            ingredientsAndMeasures.map((element, index) => (
              <li
                data-testid={ `${index}-ingredient-name-and-measure` }
                key={ `ingredient${index}` }
              >
                { element }
              </li>
            ))
          }
        </ul>
        <p className="title">Instructions</p>
        <div className="instructions-container">
          <p data-testid="instructions">
            { drinkDetails.strInstructions }
          </p>
        </div>
      </div>
      <div className="carousel-container">
        <Slider { ...sliderSettings }>
          {
            recommendedForThisDrink.map((food, index) => (
              <div
                className="carousel-holder"
                key={ food }
                data-testid={ `${index}-recomendation-card` }
              >
                <div className="carousel-card">
                  <img
                    className="carousel-img"
                    src={ food.strMealThumb }
                    alt={ food.strMealThumb }
                  />
                  <h4
                    className="carousel-title"
                    data-testid={ `${index}-recomendation-title` }
                  >
                    { food.strMeal }
                  </h4>
                </div>
              </div>
            ))
          }
        </Slider>
      </div>
      <div className="container-btn">
        <Link to={ `/bebidas/${id}/in-progress` }>
          <button
            type="button"
            data-testid="start-recipe-btn"
            className="start-recipe-btn"
            style={ startButtonVisibility }
          >
            { startRecipeButton }
          </button>
        </Link>
      </div>
    </div>
  );
}

DetalhesBebidas.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default DetalhesBebidas;
