import React, { useEffect, useState } from 'react';
import { FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { useCart } from '../../hooks/CartHook';
import api from '../../services/api';

import './styles.css';

function Carrinho() {
    const history = useHistory();
    const { itens, removeItem, setObservations } = useCart();

    
    const [cliente, setCliente] = useState({});

    useEffect(() => {
        let link = '';
        if(window.location.href.includes('https')){
          link = window.location.href.split('https://')[1];
        } else{
          link = window.location.href.split('http://')[1]; 
        }

        api.get('clientes/'+link.split('.')[0]).then(response =>{
            setCliente(response.data[0]);
        })
    }, []);

    function handleBackButton() {
        history.push('/');
    }

    function handleOrderButton() {
        const observations = document.getElementById('observations').value;
        
        setObservations(observations);

        history.push('/checkout');
    }

    return (
        <div id="carrinho_container">
            <header>
                <Link to="/">
                    Voltar ao menu 
                    <FiChevronRight size={16}></FiChevronRight>
                </Link>
            </header>
            <main>
                <h1>Carrinho</h1>

                <div id="itens_container">
                    {itens.length > 0 ? (
                        <>
                            { itens.map((item, index) => (
                                <div className="item" key={index}>
                                    <div className="item_info">
                                        {item.imagem && (
                                            <img src={item.imagem} alt={item.name} />
                                        )}

                                        <div className="item_desc">
                                            <p>{item.nome}</p>
                                            <p>Quantidade: {item.amount}</p>
                                            <span>Un: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}</span><br/>
                                            <span>Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco * item.amount)}</span>
                                        </div>
                                    </div>

                                    <button 
                                        className="deleteItem" 
                                        onClick={() => {removeItem(item.id)}} 
                                    >
                                        <FiTrash2 size={18} color="#fff" />
                                    </button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="emptyCart">
                            <span>Ops, seu carrinho está vazio!</span>
                            <button onClick={handleBackButton}>Voltar ao menu</button>
                        </div>
                    )}
                </div>

                <div className="observations">
                    <textarea 
                        id="observations" 
                        placeholder="Alguma observação sobre o pedido? Escreva aqui!" 
                    />

                    <span>**Combine a entrega com o vendedor</span>
                </div>

                <div className="button_container">
                    <button
                        className="orderButton"
                        disabled={(!cliente.aceitar_pix && !cliente.aceitar_whatsapp) || (itens.length === 0)}
                        onClick={handleOrderButton}
                    >
                        Fazer Pedido
                    </button>
                </div>
            </main>
        </div>
    )
}

export default Carrinho;