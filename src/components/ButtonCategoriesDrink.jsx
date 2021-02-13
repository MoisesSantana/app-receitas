import React, { useState, useContext, useEffect } from 'react';
import CoffeAndCodeContext from '../context/CoffeeAndCodeContext';
import '../styles/components/btnCategories.css';

import {
  requestApiDrinkListCategories,
  requestApiDrinkFilterName,
  requestApiDrinkFilterCategories,
} from '../services/requestDrink';

function ButtonCategoriesDrink() {
  const [categorySelectedPreviously, setCategorySelectedPreviously] = useState('All');

  const {
    categoriesButtonDrink,
    setCategoriesButtonDrink,
    setCardDrink,
  } = useContext(CoffeAndCodeContext);

  const getCategoriesDrinkArray = async () => {
    const firstIndex = 0;
    const lastIndex = 5;
    const apiResult = await requestApiDrinkListCategories();
    const currentDrinkCategories = apiResult.slice(firstIndex, lastIndex)
      .map(({ strCategory }) => strCategory);
    const expectedDrinkCategories = ['All', ...currentDrinkCategories];
    setCategoriesButtonDrink(expectedDrinkCategories);
  };

  useEffect(() => {
    if (!categoriesButtonDrink.length) getCategoriesDrinkArray();
  }, []);

  const selectedCategory = async (category) => {
    if (category === categorySelectedPreviously || category === 'All') {
      const allRecipes = await requestApiDrinkFilterName();
      setCardDrink(allRecipes);
      setCategorySelectedPreviously('All');
    } else {
      const filteredRecipes = await requestApiDrinkFilterCategories(category);
      setCardDrink(filteredRecipes);
      setCategorySelectedPreviously(category);
    }
  };

  if (!categoriesButtonDrink.length) return <span>Loading...</span>;

  return (
    <div className="container-btn-categories">
      {
        categoriesButtonDrink.map((category) => (
          <button
            className="btn-categories"
            data-testid={ `${category}-category-filter` }
            type="button"
            key={ category }
            onClick={ () => selectedCategory(category) }
          >
            { category }
          </button>
        ))
      }
    </div>
  );
}

export default ButtonCategoriesDrink;
