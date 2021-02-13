import React, { useState, useContext, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { loadState } from '../services/localStorage';
import CoffeAndCodeContext from '../context/CoffeeAndCodeContext';
import shareIcon from '../images/shareIcon.svg';
import '../styles/pages/receitasFeitas.css';

function ReceitasFeitas() {
  const [currentCategory, setCurrentCategory] = useState('All');
  const [doneRecipeList, setDoneRecipeList] = useState([]);

  const { copyVisibility, setCopyVisibility } = useContext(CoffeAndCodeContext);

  const updateDoneRecipes = () => {
    const loadStore = loadState('doneRecipes', []);
    switch (currentCategory) {
    case 'All':
      return loadStore;
    case 'Food':
      return loadStore.filter((currentObject) => currentObject.type === 'comida');
    case 'Drinks':
      return loadStore.filter((currentObject) => currentObject.type === 'bebida');
    default:
      console.log('Não foi possível selecionar a categoria');
    }
  };

  const getUrl = (type, id) => `http://localhost:3000/${type}s/${id}`;

  const changeCurrentFilter = ({ target: { name } }) => {
    if (name === currentCategory) setCurrentCategory('All');
    else setCurrentCategory(name);
  };

  useEffect(() => {
    setDoneRecipeList(updateDoneRecipes());
  }, [currentCategory]);

  const showMessage = () => {
    setCopyVisibility('visible');
    setTimeout(() => {
      setCopyVisibility('hidden');
    }, 3000);
  };

  return (
    <div className="finished-recipes-container">
      <Header name="Receitas Feitas" button={ false } />
      <div className="container-btn">
        <button
          className="btn-recipes"
          type="button"
          data-testid="filter-by-all-btn"
          name="All"
          onClick={ (event) => changeCurrentFilter(event) }
        >
          All
        </button>
        <button
          className="btn-recipes"
          type="button"
          data-testid="filter-by-food-btn"
          name="Food"
          onClick={ (event) => changeCurrentFilter(event) }
        >
          Food
        </button>
        <button
          className="btn-recipes"
          type="button"
          data-testid="filter-by-drink-btn"
          name="Drinks"
          onClick={ (event) => changeCurrentFilter(event) }
        >
          Drinks
        </button>
      </div>
      <div className="recipe-list-container">
        {
          doneRecipeList.map((card, index) => (
            <div
              className="holder-finished-recipes"
              key={ `${index}-${card.name}` }
            >
              <div className="image-container">
                <Link to={ `${card.type}s/${card.id}` }>
                  <img
                    className="image-finished-recipes"
                    src={ card.image }
                    alt={ card.name }
                    style={ { width: '20vw' } }
                    data-testid={ `${index}-horizontal-image` }
                  />
                </Link>
              </div>
              <div className="recipe-info">
                <div className="recipe-info-up">
                  <div>
                    <Link to={ `${card.type}s/${card.id}` }>
                      <span
                        className="recipe-name"
                        data-testid={ `${index}-horizontal-name` }
                      >
                        { card.name }
                      </span>
                    </Link>
                  </div>
                  {
                    card.type === 'comida' ? (
                      <span
                        data-testid={ `${index}-horizontal-top-text` }
                      >
                        { `${card.area} - ${card.category}` }
                      </span>
                    ) : (
                      <span
                        data-testid={ `${index}-horizontal-top-text` }
                      >
                        { card.alcoholicOrNot }
                      </span>
                    )
                  }
                </div>
                <span
                  data-testid={ `${index}-horizontal-done-date` }
                >
                  { `Feita em: ${card.doneDate}` }
                </span>
                {
                  card.tags && (
                    card.tags.map((tag) => (
                      <span
                        className="span-tag"
                        key={ tag }
                        data-testid={ `${index}-${tag}-horizontal-tag` }
                      >
                        { tag }
                      </span>
                    ))
                  )
                }
              </div>
              <div className="share-btn">
                <CopyToClipboard text={ getUrl(card.type, card.id) }>
                  <button
                    className="btn-copy"
                    onClick={ showMessage }
                    type="button"
                  >
                    <img
                      src={ shareIcon }
                      data-testid={ `${index}-horizontal-share-btn` }
                      alt="share button"
                    />
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          ))
        }
      </div>
      <small
        style={ { visibility: copyVisibility } }
      >
        Link copiado!
      </small>
    </div>
  );
}

export default ReceitasFeitas;
