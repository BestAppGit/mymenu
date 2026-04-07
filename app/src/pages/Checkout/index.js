import React, { useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { useCart } from '../../hooks/CartHook';
import api from '../../services/api';

import pixIcon from '../../assets/pix.png';
import whatsappIcon from '../../assets/whatsapp.png';

import './styles.css';

function Checkout() {
    const history = useHistory();
    const { itens: itensCart, observations, totalValue, clearCart, setName } = useCart();
    const [cliente, setCliente] = useState({});

    if (itensCart.length === 0) {
        history.push('/');
    }

    let link = '';
    if(window.location.href.includes('https')){
      link = window.location.href.split('https://')[1];
    } else{
      link = window.location.href.split('http://')[1]; 
    }

    useEffect(() => {
        api.get('clientes/'+link.split('.')[0]).then(response =>{
            setCliente(response.data[0]);
        })
    }, [link]);

    async function handleCreateOrderButton() {
        const nome = document.getElementById('name').value;
        const whatsapp = document.getElementById('whatsapp').value;

        if (!nome || !whatsapp) {
            alert('Preencha os campos para continuar.');
            return;
        }

        setName(nome);

        const itens = itensCart.map(item => ({ id: item.id, nome: item.nome, quantidade: item.amount }));

        const body = {
            cliente_id: cliente.id,
            nome: nome,
            meio_pagamento: 'PIX',
            whatsapp: whatsapp,
            observacao: observations,
            valor: totalValue,
            itens: itens,
        }

        const response = await api.post(`pedidos`, body, {
            headers: {
                'authorization': cliente.id
            }
        })

        if (response.data === "Estoque insuficiente") {
            alert('Algum produto do carrinho está sem estoque suficiente. Tente fazer o pedido novamente.');

            clearCart();

            history.push('/');

            return;
        }
        
        history.push('/pedido-concluido');
    }

    async function handleCreateOrderViaWhatsapp() {
        const nome = document.getElementById('name').value;
        const whatsapp = document.getElementById('whatsapp').value;

        if (!nome || !whatsapp) {
            alert('Preencha os campos para continuar.');
            return;
        }

        let response = await api.get('clientes/'+link.split('.')[0])

        const cliente = response.data[0];

        const itens = itensCart.map(item => ({ id: item.id, name: item.nome, quantidade: item.amount  }));

        const body = {
            cliente_id: cliente.id,
            nome: nome,
            meio_pagamento: 'Whatsapp',
            whatsapp: whatsapp,
            observacao: observations,
            itens: itens,
        }

        response = await api.post(`pedidos`, body, {
            headers: {
                'authorization': cliente.id,
                'Content-Type': 'application/json'
            }
        })
        

        if (response.data === "Estoque insuficiente") {
            alert('Algum produto do carrinho está sem estoque suficiente. Tente adicionar novamente.');

            clearCart();

            history.push('/');

            return;
        }

        console.log('itens', itens)

        let pedido = '';
        itens.forEach((item, index) => {
            pedido += `${item.name} x ${item.quantidade} ${index === (itens.length - 1) ? '.' : ', '}`;
        });

        const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue);
        
        let message = `Olá *${cliente.nome_empresa}*, tenho um novo pedido:\n
        *Nome:* ${nome}
        *Pedido:* ${pedido}
        *Valor:* ${price}
        ${observations ? `*Obs:* ${observations}\n` : ''}
        Aguardo sua confirmação!`

        message = window.encodeURIComponent(message);
        
        window.open(`https://api.whatsapp.com/send?phone=+55${cliente.whatsapp}&text=${message}`)
        
        clearCart();

        history.push('/');
    }

    return (
        <div id="checkout_container">
            <header>
                <Link to="/carrinho">
                    Voltar ao carrinho
                    <FiChevronRight size={16}></FiChevronRight>
                </Link>
            </header>
            <main>
                <h1>Checkout</h1>

                <div className="inputs_container">
                    <input type="text" id="name" placeholder="Nome" required />

                    <input 
                        type="tel" 
                        id="whatsapp" 
                        placeholder="(11) 91234-5678" 
                        required 
                    />
                </div>

                <div className="buttons_container">
                    {!!cliente.aceitar_pix && (
                        <button 
                            className="pixButton" 
                            onClick={handleCreateOrderButton}
                        >
                            Pedir via Pix
                            <img src={pixIcon} alt="Pix" />
                        </button>
                    )}

                    {!!cliente.aceitar_whatsapp && (
                        <button 
                            className="whatsButton" 
                            onClick={handleCreateOrderViaWhatsapp}
                        >
                            Pedir via Whats
                            <img src={whatsappIcon} alt="Whatsapp" />
                        </button>
                    )}
                </div>

                <div className="order">
                    <h3>Resumo do pedido</h3>

                    <div id="itens_container">
                        {itensCart.map((item, index) => (
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
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Checkout;