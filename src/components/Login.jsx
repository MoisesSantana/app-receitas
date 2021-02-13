import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CoffeAndCodeContext from '../context/CoffeeAndCodeContext';
import { saveState } from '../services/localStorage';
import '../styles/components/login.css';
import coffee from '../images/coffee.svg';

function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
  } = useContext(CoffeAndCodeContext);

  const isEmail = ({ target: { value } }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test;
    if (emailRegex.test(value)) setEmail(value);
    else setEmail('');
  };

  const isPassword = ({ target: { value } }) => {
    const minimumLength = 6;
    if (value.length > minimumLength) setPassword(value);
    else setPassword('');
  };

  const submit = () => {
    saveState('mealsToken', 1);
    saveState('cocktailsToken', 1);
    saveState('user', { email });
  };

  return (
    <div className="container-login">
      <div>
        <header>
          <h1
            className="header-login"
          >
            &lt;Coffee and Code /&gt;
          </h1>
        </header>
        <section className="login">
          <div>
            <img
              className="coffee"
              src={ coffee }
              alt="login icon"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              onChange={ isEmail }
              data-testid="email-input"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              onChange={ isPassword }
              data-testid="password-input"
              placeholder="password"
            />
          </div>
          <div className="container-btn-enter">
            <Link to="/comidas">
              <button
                className="btn-login"
                data-testid="login-submit-btn"
                type="button"
                disabled={ !email || !password }
                onClick={ submit }
              >
                Enter
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
