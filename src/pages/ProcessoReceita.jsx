import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import FavoriteHeart from '../components/FavoriteHeart';
import CoffeAndCodeContext from '../context/CoffeeAndCodeContext';
import shareIcon from '../images/shareIcon.svg';
import { loadState, saveState } from '../services/localStorage';
import { requestApiFoodDetails } from '../services/requestFood';
import '../styles/pages/processo.css';

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

const initialCountValue = (id) => {
  const getMealsFromStorage = loadState('inProgressRecipes', {});
  const zero = 0;
  if (getMealsFromStorage.meals && getMealsFromStorage.meals[id]) {
    const getCurrentIdArray = getMealsFromStorage.meals[id];
    return getCurrentIdArray.length;
  } return zero;
};

function ProcessoReceita({ match: { params: { id } } }) {
  const [countCheck, setCountCheck] = useState(initialCountValue(id));
  const [url, setUrl] = useState(window.location.href);

  const getInitialCheckBoxArray = () => {
    const emptyArray = [];
    const loadStorage = loadState('inProgressRecipes', { meals: { [id]: emptyArray } });
    if (loadStorage.meals) {
      const thereIsTheIdKey = Object.keys(loadStorage.meals)
        .some((key) => key === id);

      if (thereIsTheIdKey) {
        return loadStorage.meals[id];
      }
    } return emptyArray;
  };

  const [checkBoxArray, setCheckBoxArray] = useState(getInitialCheckBoxArray());

  const {
    ingredientsAndMeasures,
    setIngredientsAndMeasures,
    foodDetails,
    setFoodDetails,
    copyVisibility,
    setCopyVisibility,
  } = useContext(CoffeAndCodeContext);

  const doneRecipe = () => {
    const date = new Date();
    const currentDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const tag = foodDetails.strTags ? foodDetails.strTags.split(',') : null;
    const loadStorage = loadState('doneRecipes', []);
    loadStorage.push({
      id,
      type: 'comida',
      area: foodDetails.strArea,
      category: foodDetails.strCategory,
      alcoholicOrNot: '',
      name: foodDetails.strMeal,
      image: foodDetails.strMealThumb,
      doneDate: currentDate,
      tags: tag,
    });
    saveState('doneRecipes', [...loadStorage]);
  };

  const callApi = async () => {
    const apiResult = await requestApiFoodDetails(id);
    setFoodDetails(apiResult[0]);
  };

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

  const handleChecked = (event, element) => {
    if (event) {
      if (event.target.checked) {
        setCheckBoxArray([...checkBoxArray, element]);
        setCountCheck(countCheck + 1);
      } else {
        const removingChecked = checkBoxArray
          .filter((check) => check !== element);

        setCheckBoxArray(removingChecked);
        setCountCheck(countCheck - 1);
      }
    }
  };

  useEffect(() => {
    const loadStorage = loadState('inProgressRecipes', {});
    saveState('inProgressRecipes', {
      ...loadStorage,
      meals: { ...loadStorage.meals, [id]: [...checkBoxArray] },
    });
  }, [checkBoxArray]);

  useEffect(() => {
    getIngredientsAndMeasures();
  }, [foodDetails]);

  useEffect(() => {
    callApi();
    const expectedUrl = url.split('/in-progress');
    setUrl(expectedUrl[0]);
  }, []);

  const showMessage = () => {
    setCopyVisibility('visible');
    setTimeout(() => {
      setCopyVisibility('hidden');
    }, 3000);
  };

  if (!foodDetails) return <span>Loading...</span>;

  return (
    <div className="recipe-process-container">
      <img
        className="image-recipe-process"
        data-testid="recipe-photo"
        src={ foodDetails.strMealThumb }
        alt="thumb"
      />
      <h1
        className="title"
        data-testid="title-process-food"
      >
        { foodDetails.strMeal }
      </h1>
      <h3
        className="category"
        data-testid="category"
      >
        <span>{ foodDetails.strCategory }</span>
      </h3>
      <div className="copy-and-favorite">
        <CopyToClipboard text={ url }>
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
          Link copiado!
        </small>
      </div>
      <div className="ingredient-container">
        <p className="title">Ingredients</p>
        <div className="ingredients">
          {
            ingredientsAndMeasures.map((ingredient, index) => {
              const checked = checkBoxArray.some((check) => check === ingredient);

              return (
                <div key={ `${ingredient}-${index}` }>
                  <label
                    htmlFor={ `${ingredient}-${index}` }
                    data-testid={ `${index}-ingredient-step` }
                    key={ `${ingredient}-${index}` }
                  >
                    <input
                      className="check"
                      type="checkbox"
                      name={ `${ingredient}-${index}` }
                      id={ `${ingredient}-${index}` }
                      checked={ checked }
                      onChange={ (event) => handleChecked(event, ingredient) }
                    />
                    { ingredient }
                  </label>
                </div>
              );
            })
          }
        </div>
        <p className="title">Instructions</p>
        <div className="instructions-container">
          <p
            data-testid="instructions"
          >
            { foodDetails.strInstructions }
          </p>
        </div>
      </div>
      <div className="container-btn">
        <Link to="/receitas-feitas">
          <button
            className="btn-finish"
            type="button"
            data-testid="finish-recipe-btn"
            disabled={ ingredientsAndMeasures.length !== countCheck }
            onClick={ doneRecipe }
          >
            Finalizar Receita
          </button>
        </Link>
      </div>
    </div>
  );
}

ProcessoReceita.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};
export default ProcessoReceita;
