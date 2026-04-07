import React, { useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/CartHook';
import api from '../../services/api';

import './styles.css';

function Produto() {
    const { id } = useParams();
    const history = useHistory();
    const { itens, insertManyItems } = useCart();

    const [item, setItem] = useState({});
    const [amount, setAmount] = useState(1);
    const [cliente, setCliente] = useState({});

    let link = '';
    if(window.location.href.includes('https')){
      link = window.location.href.split('https://')[1];
    } else{
      link = window.location.href.split('http://')[1]; 
    }

    useEffect(() => {
        api.get('clientes/'+link.split('.')[0]).then(response =>{
            setCliente(response.data[0]);
            api.get(`itens/${id}`, {
                headers: {
                    'authorization' : response.data[0].id
                }
            }).then((response) => {
                const item = response.data[0];

                setItem(item);
            });
        });
    }, [link, id]);

    function handleRemoveButton() {
        if (amount > 1) {
            setAmount(state => state - 1);
        }
    }

    function handleAddButton() {
        if (Number(item.estoque)) {
            if (amount < item.estoque) {
                setAmount(state => state + 1);
            }
        }else {
            setAmount(state => state + 1);
        }
    }

    function handleAddItemToCart() {
        if (amount > 5) {
            const confirm = window.confirm(`Você tem certeza que deseja adicionar ${amount}x ${item.nome} no carrinho?`);
            
            if (!confirm) {
                return;
            }
        } 

        const newItems = itens.map(product => {
            return product.id === item.id ? { ...product, amount: product.amount + amount } : product
        })

        const ids = itens.map(product => { return product.id })

        ids.includes(item.id) ? insertManyItems(newItems) : insertManyItems([...newItems, { ...item, amount}])

        history.push(`/carrinho`);
    }

    return (
        <div id="product_container">
            <header>
                <Link to="/">
                    Voltar ao menu 
                    <FiChevronRight size={16}></FiChevronRight>
                </Link>
            </header>
            <main>
                {item.imagem ? (
                    <img src={item.imagem} alt={item.nome} />
                ) : (
                    <div className="imagePlaceholder"></div>
                )} 

                <h1>{item.nome}</h1>
                <p>{item.descricao}</p>

                <span className="price">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}</span>

                <div className="buttonsContainer">
                    <div className="counter">
                        <button onClick={handleRemoveButton}>-</button>
                        <span>{amount}</span>
                        <button onClick={handleAddButton}>+</button>
                    </div>

                    {item.estoque === 0 ? (          
                        <button 
                            className="addToCart"
                            disabled={true}
                            onClick={handleAddItemToCart}
                        >
                                Sem estoque
                        </button>
                    ) : (
                        <button 
                            className="addToCart"
                            disabled={(!cliente.aceitar_pix && !cliente.aceitar_whatsapp)}
                            onClick={handleAddItemToCart}
                        >
                                Adicionar ao carrinho
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Produto;