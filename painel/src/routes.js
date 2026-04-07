import React from 'react';
import {Route, BrowserRouter, Redirect} from 'react-router-dom';

import Cardapio from './pages/Cardapio';
import Categorias from './pages/Categorias';
import Configuracoes from './pages/Configuracoes';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Pedidos from './pages/Pedidos';

const Routes = () =>{
    return (
        <BrowserRouter>
            <Route path="/" exact>
                <Redirect to="/admin" />
            </Route>
            <Route component={Cardapio} path="/admin/" exact />
            <Route component={Categorias} path="/admin/categorias" exact />
            <Route component={Login} path="/admin/login" exact />
            <Route component={Configuracoes} path="/admin/configuracoes" exact />
            <Route component={Pedidos} path="/admin/pedidos" exact />
            <Route component={Admin} path="/admin/menu-admin" exact />
        </BrowserRouter>
    );
}

export default Routes;