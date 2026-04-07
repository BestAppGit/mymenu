import React from 'react';

import Routes from './routes';

import { CartProvider } from './hooks/CartHook';

function App() {
  return (
    <div>
      <div className="bg"></div>
      <CartProvider>
        <Routes />
      </CartProvider>
    </div>
  );
}

export default App;
