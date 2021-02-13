import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/components/footer.css';
import shareIcon from '../images/shareIcon.svg';
import { loadState } from '../services/localStorage';
import FavoriteHeart from '../components/FavoriteHeart';
import CoffeAndCodeContext from '../context/CoffeeAndCodeContext';
import { requestApiFoodDetails } from '../services/requestFood';
import { recommendDrinksList } from '../services/requestDrink';
import '../styles/pages/detalhes.css';

const filteredIngredientsAndMeasures = (
  detailsEntries,
  filteredIngredients,
  filteredMeasures,
) => {
  const ingredientRegex = /strIngredient/i;
  const measureRegex = /strMeasure/i;

  detailsEntries.forEach((currentArray) => {
    if (currentArray[1] !== null) {
      if (ingredientRegex.test(currentArray[0]) && currentArray[1].trim() !== '') {
        filteredIngredients.push(currentArray[1]);
      }

      if (measureRegex.test(currentArray[0]) && currentArray[1].trim() !== '') {
        filteredMeasures.push(currentArray[1]);
      }
    }
  });
};

function DetalhesReceitas({ match: { params: { id } } }) {
  const [videoLink, setVideoLink] = useState('');
  const [recommendedForThisFood, setRecommendedForThisFood] = useState([]);
  const [startRecipeButton, setStartRecipeButton] = useState('Iniciar Receita');
  const [startButtonVisibility, setStartButtonVisibility] = useState({});
  const {
    ingredientsAndMeasures,
    setIngredientsAndMeasures,
    foodDetails,
    setFoodDetails,
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
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
  const getIngredientsAndMeasures = () => {
    const detailsEntries = Object.entries(foodDetails);
    const filteredIngredients = [];
    const filteredMeasures = [];
    const expectedArray = [];

    filteredIngredientsAndMeasures(detailsEntries, filteredIngredients, filteredMeasures);

    filteredMeasures.forEach((measure, index) => {
      expectedArray.push(`${filteredIngredients[index]} ${measure}`);
    });
    setIngredientsAndMeasures(expectedArray);
  };

  const getVideoLink = () => {
    if (foodDetails.strYoutube) {
      const splitLink = foodDetails.strYoutube.split('=');
      const endOfLink = splitLink[splitLink.length - 1];
      const expectedLink = `https://www.youtube.com/embed/${endOfLink}`;
      setVideoLink(expectedLink);
    }
  };

  const getTheRecommendedDrinks = async () => {
    if (foodDetails) {
      const firstIndex = 0;
      const lastIndex = 6;
      const recommendedDrinksArray = await recommendDrinksList();
      const expectedArray = recommendedDrinksArray.drinks.slice(firstIndex, lastIndex);
      setRecommendedForThisFood(expectedArray);
    }
  };

  const setStateOfStartRecipe = () => {
    if (localStorage.getItem('inProgressRecipes')) {
      const loadStorage = loadState('inProgressRecipes', '');
      if (loadStorage.meals && loadStorage.meals[id]) {
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
    getVideoLink();
    getTheRecommendedDrinks();
    setStateOfStartRecipe();
    testRecipeDone();
  }, [foodDetails]);

  const callMainApi = async () => {
    const apiResult = await requestApiFoodDetails(id);
    setFoodDetails(apiResult[0]);
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

  if (!foodDetails) return <span>Loading...</span>;

  return (
    <div className="details-container">
      <img
        className="image-recipe"
        src={ foodDetails.strMealThumb }
        alt={ foodDetails.strMeal }
        data-testid="recipe-photo"
      />
      <h1 data-testid="recipe-title" className="title">
        { foodDetails.strMeal }
        <h3 data-testid="recipe-category" className="category">
          <span>{ foodDetails.strCategory }</span>
        </h3>
      </h1>
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
        <FavoriteHeart id={ id } food />
        <small
          style={ { visibility: copyVisibility } }
        >
          <p>Link copiado!</p>
        </small>
      </div>
      <div>
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
              { foodDetails.strInstructions }
            </p>
          </div>
        </div>
      </div>
      <iframe
        className="video"
        src={ videoLink }
        data-testid="video"
        title="video"
        width="100%"
        height="360"
        allow="accelerometer;
        autoplay;
        clipboard-write;
        encrypted-media;
        gyroscope;
        picture-in-picture"
        fs="1"
      />
      <div className="carousel-container">
        <Slider { ...sliderSettings }>
          {
            recommendedForThisFood.map((drink, index) => (
              <div
                className="carousel-holder"
                key={ drink }
                data-testid={ `${index}-recomendation-card` }
              >
                <div className="carousel-card">
                  <img
                    className="carousel-img"
                    src={ drink.strDrinkThumb }
                    alt={ drink.strDrinkThumb }
                  />
                  <h4
                    className="carousel-title"
                    data-testid={ `${index}-recomendation-title` }
                  >
                    { drink.strDrink }
                  </h4>
                </div>
              </div>
            ))
          }
        </Slider>
      </div>
      <div className="container-btn">
        <Link to={ `/comidas/${id}/in-progress` }>
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

DetalhesReceitas.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default DetalhesReceitas;
