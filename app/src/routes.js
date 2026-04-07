import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Home from './pages/Home';
import Produto from './pages/Produto';
import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout';
import PedidoConcluido from './pages/PedidoConcluido';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={Produto} path="/produto/:id" exact />
            <Route component={Carrinho} path="/carrinho" exact />
            <Route component={Checkout} path="/checkout" exact />
            <Route component={PedidoConcluido} path="/pedido-concluido" exact />
        </BrowserRouter>
    );
}

export default Routes;