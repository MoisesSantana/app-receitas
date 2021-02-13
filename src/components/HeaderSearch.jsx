import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import CoffeAndCodeContext from '../context/CoffeeAndCodeContext';
import {
  requestApiFoodFilterIngredient,
  requestApiFoodFilterName,
  requestApiFoodFilterFirstLetter,
} from '../services/requestFood';
import {
  requestApiDrinkFilterIngredient,
  requestApiDrinkFilterName,
  requestApiDrinkFilterFirstLetter,
} from '../services/requestDrink';
import '../styles/components/headerSearch.css';

function HeaderSearch({ name }) {
  const [textSearch, setTextSearch] = useState('');
  const [radioValue, setRadioValue] = useState('');
  const [click, setClick] = useState(false);
  const [redirectFood, setRedirectFood] = useState(false);
  const [redirectDrink, setRedirectDrink] = useState(false);

  const {
    setCardDrink,
    setCardFood,
    cardDrink,
    cardFood,
  } = useContext(CoffeAndCodeContext);

  const searchFood = () => {
    if (radioValue === 'ingredientSearch' && textSearch !== '') {
      return requestApiFoodFilterIngredient(textSearch);
    }
    if (radioValue === 'nameSearch' && textSearch !== '') {
      return requestApiFoodFilterName(textSearch);
    }
    if (radioValue === 'firstLetterSearch' && textSearch.length === 1) {
      return requestApiFoodFilterFirstLetter(textSearch);
    }
    if (radioValue === 'firstLetterSearch') {
      alert('Sua busca deve conter somente 1 (um) caracter');
    }
  };

  const searchDrink = () => {
    if (radioValue === 'ingredientSearch' && textSearch !== '') {
      return requestApiDrinkFilterIngredient(textSearch);
    }
    if (radioValue === 'nameSearch' && textSearch !== '') {
      return requestApiDrinkFilterName(textSearch);
    }
    if (radioValue === 'firstLetterSearch' && textSearch.length === 1) {
      return requestApiDrinkFilterFirstLetter(textSearch);
    }
    if (radioValue === 'firstLetterSearch') {
      alert('Sua busca deve conter somente 1 (um) caracter');
    }
  };

  const printError = () => {
    setClick(false);
    alert('Sinto muito, não encontramos nenhuma receita para esses filtros.');
  };

  const searchOnClick = async () => {
    setClick(true);
    if (name === 'Comidas') {
      const answerApi = await searchFood();
      if (answerApi) setCardFood(answerApi);
      else printError();
    }
    if (name === 'Bebidas') {
      const answerApi = await searchDrink();
      if (answerApi) setCardDrink(answerApi);
      else printError();
    }
  };

  useEffect(() => {
    if (click) {
      setClick(false);
      if (cardFood.length === 1) setRedirectFood(true);
      if (cardDrink.length === 1) setRedirectDrink(true);
    }
  }, [cardDrink, cardFood]);

  return (
    <section className="header-search">
      { redirectDrink && <Redirect to={ `/bebidas/${cardDrink[0].idDrink}` } /> }
      { redirectFood && <Redirect to={ `/comidas/${cardFood[0].idMeal}` } /> }
      <div>
        <input
          className="input-header-text"
          type="text"
          name="searchInput"
          id="searchInput"
          placeholder="Buscar Receita"
          data-testid="search-input"
          onChange={ (event) => setTextSearch(event.target.value) }
        />
      </div>
      <div className="main-radio-container">
        <div className="radio-container">
          <input
            type="radio"
            name="searchFilter"
            id="ingredientSearch"
            data-testid="ingredient-search-radio"
            onClick={ (event) => setRadioValue(event.target.id) }
          />
          <label htmlFor="ingredientSearch" className="ingredient-label">
            Ingrediente
          </label>
        </div>
        <div className="radio-container">
          <input
            type="radio"
            name="searchFilter"
            id="nameSearch"
            data-testid="name-search-radio"
            onClick={ (event) => setRadioValue(event.target.id) }
          />
          <label htmlFor="nameSearch" className="name-label">
            Nome
          </label>
        </div>
        <div className="radio-container">
          <input
            type="radio"
            name="searchFilter"
            id="firstLetterSearch"
            data-testid="first-letter-search-radio"
            onClick={ (event) => setRadioValue(event.target.id) }
          />
          <label htmlFor="firstLetterSearch" className="first-letter-label">
            Primeira letra
          </label>
        </div>
      </div>
      <div className="btn-container">
        <button
          className="btn-header-search"
          type="button"
          data-testid="exec-search-btn"
          onClick={ searchOnClick }
        >
          Buscar
        </button>
        <hr />
      </div>
    </section>
  );
}

HeaderSearch.propTypes = { name: PropTypes.string.isRequired };

export default HeaderSearch;
