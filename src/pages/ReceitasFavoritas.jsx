import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { loadState } from '../services/localStorage';
import shareIcon from '../images/shareIcon.svg'
import Header from '../components/Header';
import FavoriteHeart from '../components/FavoriteHeart';
import CoffeeAndCodeContext from '../context/CoffeeAndCodeContext';
import '../styles/pages/favoritas.css';

function ReceitasFavoritas() {
  const [category, setCategory] = useState('All');
  const { copyVisibility, setCopyVisibility } = useContext(CoffeeAndCodeContext);

  const renderRecipes = () => {
    const fullListOfFavoriteRecipes = loadState('favoriteRecipes', []);
    if (category === 'All') return fullListOfFavoriteRecipes;
    if (category === 'Food') return fullListOfFavoriteRecipes
      .filter(({ type }) => type === 'comida');
    if (category === 'Drink') return fullListOfFavoriteRecipes
      .filter(({ type }) => type === 'bebida');
  };

  const showMessage = () => {
    setCopyVisibility('visible');
    setTimeout(() => {
      setCopyVisibility('hidden');
    }, 3000);
  }

  return (
    <div className="favorite-recipes-container">
        <Header name="Receitas Favoritas" button={ false } />
        <div className="container-btn">
          <button
            className="category-btn"
            type="button"
            data-testid="filter-by-all-btn"
            value="All"
            onClick={ () => setCategory('All') }
          >
            All
          </button>
          <button
            className="category-btn"
            type="button"
            data-testid="filter-by-food-btn"
            value="Food"
            onClick={ () => setCategory('Food') }
          >
            Food
          </button>
          <button
            className="category-btn"
            type="button"
            data-testid="filter-by-drink-btn"
            value="Drinks"
            onClick={ () => setCategory('Drink') }
          >
            Drink
          </button>
        </div>
        <div className="favorite-recipes-list-container">
          {
            renderRecipes().map((recipe, index) => (
              <div
                className="holder-favorite-recipes"
                key={ `${index}-${recipe.name}` }
              >
                <div className="image-container">
                  <Link to={ `/${recipe.type}s/${recipe.id}` }>
                    <img
                      className="image-favorite-recipes"
                      src={ recipe.image }
                      alt={ recipe.name }
                      data-testid={ `${index}-horizontal-image` }
                    />
                  </Link>
                </div>
                <div className="recipe-info">
                  <div className="recipe-info-up">
                    <Link to={ `/${recipe.type}s/${recipe.id}` }>
                      <span
                        className="recipe-name"
                        data-testid={ `${index}-horizontal-name` }
                      >{ recipe.name }</span>
                    </Link>
                  </div>
                  <div>
                    {
                      (recipe.type === 'comida') ? (
                        <span
                          data-testid={ `${index}-horizontal-top-text` }
                        >{ recipe.area } - { recipe.category } </span>
                      ) : (
                        <span
                          data-testid={ `${index}-horizontal-top-text` }
                        >{ recipe.alcoholicOrNot }</span>
                      )
                    }
                  </div>
                </div>
                <div className="copy-and-favorite">
                  <CopyToClipboard text={ `http://localhost:3000/${recipe.type}s/${recipe.id}` }>
                    <button
                      type="button"
                      data-testid="share-btn"
                      onClick={ showMessage }
                    >
                      <img src={ shareIcon } alt="Share icon" />
                    </button>
                  </CopyToClipboard>
                </div>
                <FavoriteHeart
                  id={ recipe.id }
                  food={ recipe.type === 'comida' }
                  drink={ recipe.type === 'bebida' }
                />
              </div>
            ))
          }
          <small
            style={ { visibility: copyVisibility } }
          >
            <p>Link copiado!</p>
          </small>
        </div>
    </div>
  );
}

export default ReceitasFavoritas;
