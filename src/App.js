import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Provider from './context/Provider';
import Home from './pages/Home';
import Comidas from './pages/Comidas';
import Perfil from './pages/Perfil';
import Bebidas from './pages/Bebidas';
import Explorar from './pages/Explorar';
import ExplorarComidas from './pages/ExplorarComidas';
import ExplorarBebidas from './pages/ExplorarBebidas';
import ComidasPorIngredientes from './pages/ComidasPorIngredientes';
import BebidasPorIngredientes from './pages/BebidasPorIngredientes';
import ComidasPorOrigem from './pages/ComidasPorOrigem';
import ReceitasFeitas from './pages/ReceitasFeitas';
import ReceitasFavoritas from './pages/ReceitasFavoritas';
import DetalhesBebida from './pages/DetalhesBebidas';
import DetalhesReceita from './pages/DetalhesReceita';
import ProcessoBebida from './pages/ProcessoBebida';
import ProcessoReceita from './pages/ProcessoReceita';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div>
      <Provider>
        <Switch>
          <Route
            exact
            path="/"
            component={ Home }
          />
          <Route
            exact
            path="/comidas"
            component={ Comidas }
          />
          <Route
            exact
            path="/perfil"
            component={ Perfil }
          />
          <Route
            exact
            path="/bebidas"
            component={ Bebidas }
          />
          <Route
            exact
            path="/explorar"
            component={ Explorar }
          />
          <Route
            exact
            path="/explorar/comidas"
            component={ ExplorarComidas }
          />
          <Route
            exact
            path="/explorar/bebidas"
            component={ ExplorarBebidas }
          />
          <Route
            exact
            path="/explorar/comidas/ingredientes"
            component={ ComidasPorIngredientes }
          />
          <Route
            exact
            path="/explorar/bebidas/ingredientes"
            component={ BebidasPorIngredientes }
          />
          <Route
            exact
            path="/explorar/comidas/area"
            component={ ComidasPorOrigem }
          />
          <Route
            exact
            path="/receitas-feitas"
            component={ ReceitasFeitas }
          />
          <Route
            exact
            path="/receitas-favoritas"
            component={ ReceitasFavoritas }
          />
          <Route
            exact
            path="/comidas/:id"
            component={ DetalhesReceita }
          />
          <Route
            exact
            path="/bebidas/:id"
            component={ DetalhesBebida }
          />
          <Route
            exact
            path="/comidas/:id/in-progress"
            component={ ProcessoReceita }
          />
          <Route
            exact
            path="/bebidas/:id/in-progress"
            component={ ProcessoBebida }
          />
          <Route component={ NotFound } />
        </Switch>
      </Provider>
    </div>
  );
}

export default App;
