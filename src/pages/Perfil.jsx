import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/perfil.css';

function Perfil() {
  const handleLocalStorageOnLogout = () => {
    if (localStorage) localStorage.clear();
  };

  const userEmail = JSON.parse(localStorage.user).email;

  return (
    <div className="perfil-container">
      <Header name="Perfil" button={ false } />
      <h4 data-testid="profile-email">
        {userEmail}
      </h4>
      <div className="container-btn-perfil">
        <Link to="/receitas-feitas">
          <button
            className="btn-perfil"
            data-testid="profile-done-btn"
            type="button"
          >
            Receitas Feitas
          </button>
        </Link>
        <Link to="/receitas-favoritas">
          <button
            className="btn-perfil"
            data-testid="profile-favorite-btn"
            type="button"
          >
            Receitas Favoritas
          </button>
        </Link>
        <Link to="/">
          <button
            className="btn-perfil"
            data-testid="profile-logout-btn"
            type="button"
            onClick={ handleLocalStorageOnLogout }
          >
            Sair
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default Perfil;
