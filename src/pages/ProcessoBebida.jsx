import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import FavoriteHeart from '../components/FavoriteHeart';
import CoffeAndCodeContext from '../context/CoffeeAndCodeContext';
import shareIcon from '../images/shareIcon.svg';
import { loadState, saveState } from '../services/localStorage';
import { requestApiDrinkDetails } from '../services/requestDrink';
import '../styles/pages/processo.css';

const filterIngredientsAndMeasures = (
  detailsEntries,
  filteredIngredients,
) => {
  const ingredientRegex = /strIngredient/i;

  detailsEntries.forEach((currentArray) => {
    if (
      ingredientRegex.test(currentArray[0])
      && currentArray[1] !== null
      && currentArray[1] !== ''
    ) {
      filteredIngredients.push(currentArray[1]);
    }
  });
};

const initialCountValue = (id) => {
  const getCocktailsFromStorage = loadState('inProgressRecipes', {});
  const zero = 0;
  if (getCocktailsFromStorage.cocktails && getCocktailsFromStorage.cocktails[id]) {
    const getCurrentIdArray = getCocktailsFromStorage.cocktails[id];
    return getCurrentIdArray.length;
  }
  return zero;
};

function ProcessoReceita({ match: { params: { id } } }) {
  const [countCheck, setCountCheck] = useState(initialCountValue(id));
  const [url, setUrl] = useState(window.location.href);

  const getInitialCheckBoxArray = () => {
    const emptyArray = [];
    const loadStorage = loadState('inProgressRecipes', {
      cocktails: { [id]: emptyArray },
    });
    if (loadStorage.cocktails) {
      const thereIsTheIdKey = Object.keys(loadStorage.cocktails)
        .some((key) => key === id);

      if (thereIsTheIdKey) return loadStorage.cocktails[id];
    } return emptyArray;
  };

  const [checkBoxArray, setCheckBoxArray] = useState(getInitialCheckBoxArray());

  const {
    ingredientsAndMeasures,
    setIngredientsAndMeasures,
    drinkDetails,
    setDrinkDetails,
    copyVisibility,
    setCopyVisibility,
  } = useContext(CoffeAndCodeContext);

  // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date

  const doneRecipe = () => {
    const date = new Date();
    const currentDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const tag = drinkDetails.strTags ? drinkDetails.strTags.split(',') : null;
    const loadStorage = loadState('doneRecipes', []);
    loadStorage.push({
      id,
      type: 'bebida',
      area: '',
      category: drinkDetails.strCategory,
      alcoholicOrNot: drinkDetails.strAlcoholic,
      name: drinkDetails.strDrink,
      image: drinkDetails.strDrinkThumb,
      doneDate: currentDate,
      tags: tag,
    });

    saveState('doneRecipes', [...loadStorage]);
  };

  const callApi = async () => {
    const apiResult = await requestApiDrinkDetails(id);
    setDrinkDetails(apiResult[0]);
  };

  const getIngredientsAndMeasures = () => {
    const detailsEntries = Object.entries(drinkDetails);
    const expectedArray = [];
    const filteredIngredients = [];

    filterIngredientsAndMeasures(detailsEntries, filteredIngredients);

    filteredIngredients.forEach((ingredient) => {
      expectedArray.push(ingredient);
    });

    setIngredientsAndMeasures(expectedArray);
  };

  const handleChecked = (event, element) => {
    if (event.target.checked) {
      setCheckBoxArray([...checkBoxArray, element]);
      setCountCheck(countCheck + 1);
    } else {
      const removingChecked = checkBoxArray
        .filter((check) => check !== element);

      setCheckBoxArray(removingChecked);
      setCountCheck(countCheck - 1);
    }
  };

  useEffect(() => {
    const loadStorage = loadState('inProgressRecipes', { cocktails: {} });

    saveState('inProgressRecipes', {
      ...loadStorage,
      cocktails: { ...loadStorage.cocktails, [id]: [...checkBoxArray] },
    });
  }, [checkBoxArray]);

  useEffect(() => {
    getIngredientsAndMeasures();
  }, [drinkDetails]);

  useEffect(() => {
    callApi();
    const expectedUrl = url.split('/in-progress');
    setUrl(expectedUrl[0]);
  }, []);

  const showMessage = () => {
    setCopyVisibility('visible');
    setTimeout(() => {
      setCopyVisibility('hidden')
    }, 3000);
  };

  if (!drinkDetails) return <span>Loading...</span>;

  return (
    <div className="recipe-process-container">
      <img
        className="image-recipe-process"
        data-testid="recipe-photo"
        src={ drinkDetails.strDrinkThumb }
        alt="thumb"
      />
      <h1
        className="title-process"
        data-testid="title-process-drink"
      >
        { drinkDetails.strDrink }
      </h1>
      <h3
        className="category"
        data-testid="category"
      >
        { drinkDetails.strCategory }
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
        <FavoriteHeart id={ id } drink />
        <small style={ { visibility: copyVisibility } }> Link copiado!</small>
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
                      onClick={ (event) => handleChecked(event, ingredient) }
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
          <p data-testid="instructions">{ drinkDetails.strInstructions }</p>
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
