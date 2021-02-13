import React from 'react';
import { Link } from 'react-router-dom';
import drinkIcon from '../images/drinkIcon.svg';
import exploreIcon from '../images/exploreIcon.svg';
import mealIcon from '../images/mealIcon.svg';
import '../styles/components/footer.css';

function Footer() {
  return (
    <footer className="footer" data-testid="footer">
      <div>
        <Link to="/bebidas">
          <img
            data-testid="drinks-bottom-btn"
            src={ drinkIcon }
            alt="drinks"
          />
        </Link>
      </div>
      <div>
        <Link to="/explorar">
          <img
            data-testid="explore-bottom-btn"
            src={ exploreIcon }
            alt="explore"
          />
        </Link>
      </div>
      <div>
        <Link to="/comidas">
          <img
            data-testid="food-bottom-btn"
            src={ mealIcon }
            alt="meal"
          />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
