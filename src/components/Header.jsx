import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import HeaderSearch from './HeaderSearch';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import '../styles/components/header.css';

function Header({ name, button }) {
  const [searchBar, setSearchBar] = useState(false);

  return (
    <div>
      <header className="container-header">
        <button
          className="left-header"
          type="button"
        >
          <Link to="/perfil">
            <img
              src={ profileIcon }
              alt="profile icon"
              data-testid="profile-top-btn"
            />
          </Link>
        </button>
        <div className="center-header">
          <h1 data-testid="page-title">{ name }</h1>
        </div>
        <div className="right-header">
          {
            button && (
              <button
                className="color-btn-header"
                type="button"
                onClick={ () => setSearchBar(!searchBar) }
              >
                <img
                  src={ searchIcon }
                  alt="search icon"
                  data-testid="search-top-btn"
                />
              </button>
            )
          }
        </div>

      </header>
      <div className="search-bar">
        { searchBar && <HeaderSearch name={ name } /> }
      </div>
    </div>
  );
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  button: PropTypes.bool.isRequired,
};

export default Header;
