import React, { createContext, useContext, useState } from "react";

const CartContext = createContext({});

export function CartProvider({ children }) {
    const [itens, setItens] = useState([]);
    const [observations, setObservations] = useState('');
    const [name, setName] = useState('');
    const [totalValue, setTotalValue] = useState(0);

    function insertManyItems(items) {
        setItens(items);

        let newValue = totalValue;

        items.forEach(item => {
            newValue += item.preco;
        });

        setTotalValue(newValue);
    }
    
    function removeItem(id) {
        const newItens = [...itens];

        const itemIndex = newItens.findIndex(item => item.id === id);
        
        setTotalValue(totalValue - itens[itemIndex].preco);

        newItens.splice(itemIndex, 1);
        
        setItens(newItens);
    }

    function clearCart() {
        setItens([]);
        setObservations('');
        setTotalValue(0);
    }

    return (
        <CartContext.Provider value={{ 
            itens, insertManyItems, removeItem, totalValue, name, setName, observations, setObservations, clearCart
        }} >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}