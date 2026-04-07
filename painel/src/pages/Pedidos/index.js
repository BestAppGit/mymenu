import React, { useEffect, useState } from 'react';
import { Card, Row } from 'react-bootstrap';
import { FiCheck, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { useHistory } from 'react-router';

import api from '../../services/api';

import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

import './styles.css';

const Pedidos = () => {
    const history = useHistory();

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filter, setFilter] =  useState("");
    const [expandedOrder, setExpandedOrder] = useState();

    if(!sessionStorage.getItem('auth')){
        history.push('/admin/login');
    }

    useEffect(() => {
        api.get(`pedidos`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }
        }).then((response) => {
            setOrders(response.data)
            console.log(response.data[0])
        })
    }, []);

    function filterItens() {
        const filter = document.getElementById('searchInputId').value.toLowerCase();
        const filterWithoutAccentuation = filter.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        
        if (filter !== '') {
            const newOrders = orders.filter(item => {
                const itemName = item.nome.toLowerCase();
                const nameWithoutAccentuation = itemName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                if (nameWithoutAccentuation.includes(filterWithoutAccentuation)) {
                    return true;
                }
                return false;
            });
    
            setFilteredOrders(newOrders);
            setFilter(filter);
        }else {
            setFilteredOrders([]);
            setFilter("");
        }
    }

    function handleChangeOrderStatus({ id, status }) {
        let newStatus;

        switch (status) {
            case 'preparing':
                newStatus = 'done';
                break;
            case 'done':
                newStatus = 'canceled';
                break;
            case 'canceled':
                newStatus = 'preparing';
                break;
        }

        const body = {
            estado: newStatus,
        }

        api.patch(`pedidos/${id}`, body, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }
        }).then((response) => {
            if (response.data === "OK") {
                api.get(`pedidos/`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'authorization' : sessionStorage.getItem('auth')
                    }
                }).then((response) => {
                    setOrders(response.data);
                });
            }
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);

        const formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}h`

        return formattedDate;
    }

    function statusButtonColor(status) {
        if (status === 'preparing')
            return '#CCC';

        if (status === 'canceled')
            return '#F00';

        if (status === 'done')
            return '#00BC64';
    }

    function handleReadMoreButton(orderId) {
        if (expandedOrder === orderId) {
            setExpandedOrder(undefined);
        } else {
            setExpandedOrder(orderId);
        }
    }

    function renderItems(itens) {
        let pedido = '';
        itens.forEach((item, index) => {
            pedido += `${item.nome} x ${item.quantidade} ${index === (itens.length - 1) ? '.' : ', '}`;
        });

        return (
            <p>
                { pedido }
            </p>
        )

    }

    return (
        <>
            <Sidebar />
            <Navbar />
            <div className="bodyContent">
                <Row className="rowHeader">
                    <div className="col-2 space"></div>
                    <div className="header">
                        <h4>Pedidos</h4>
                        <div className="searchInput">
                            <input id="searchInputId" onChange={()=> filterItens()} placeholder="Pesquise por nomes, preços e categorias"/>  

                            <button onClick={filterItens}>
                                <FiSearch size={16} color="#444"/>
                            </button>
                        </div>
                        <div></div>
                    </div>
                </Row>
                <Row className="rowHeader">
                    <Card className="col-10 tableCardapio">
                        <div className="ordersList">
                            <div className="listHeader">
                                <p id="headerName" style={{width: '20%'}} >Nome</p>
                                <p id="headerWhats" style={{width: '12%'}} >Whatsapp</p>
                                <p id="headerOrder" style={{width: '25%'}} >Pedido</p>
                                <p id="headerObs" style={{width: '30%'}} >Observação</p>
                                <p id="headerPrice" style={{width: '10%'}} >Valor</p>
                                <p id="headerStatus" style={{width: '3%'}} ></p>
                            </div>
                            <div className="orders">
                                {filter.length === 0 ? orders.map(order => (
                                    <div className={`order ${expandedOrder === order.id && 'expanded'}`} key={order.id}>
                                        <div className="listName" id="listName" style={{width: '20%'}} >
                                            <p>{order.nome}</p>
                                            <p style={{ fontSize: 13 }}>
                                                <span style={{ color: order.meio_pagamento.toUpperCase() === 'PIX' ? '#00BDAE' : '#00BC64' }}>{order.meio_pagamento.toUpperCase()} </span> 
                                                {formatDate(order.created_at)}
                                            </p>

                                            <div className="expandedOrder">
                                                <span>Pedido</span>
                                                { 
                                                    renderItems(order.new_itens) 
                                                }
                                                
                                                <span>Obs.</span>
                                                <p>{order.observacao}</p>

                                                <span>Valor</span>
                                                <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.valor)}</p>
                                            </div>
                                        </div>
                                        <div id="listWhats" style={{width: '12%'}} >
                                            <a target="_blank" href={`https://wa.me/+55${order.whatsapp}`}>
                                                {order.whatsapp}
                                            </a>
                                            {expandedOrder === order.id ? (
                                                <button className="readMoreButton" onClick={() => handleReadMoreButton(order.id)}>
                                                    Ocultar <FiChevronUp size={14} />
                                                </button>
                                            ) : (
                                                <button className="readMoreButton" onClick={() => handleReadMoreButton(order.id)}>
                                                    Detalhes <FiChevronDown size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <p id="listOrder" style={{width: '25%'}} >
                                            { 
                                                renderItems(order.new_itens) 
                                            }
                                        </p>
                                        <p id="listObs" style={{width: '30%'}}>
                                            {order.observacao}
                                        </p>
                                        <p id="listPrice" style={{width: '10%'}} > 
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.valor)}
                                        </p>
                                        <div id="listStatus" style={{width: '3%'}}>
                                            <button 
                                                style={{backgroundColor: `${statusButtonColor(order.estado)}`}} 
                                                id="statusButton"
                                                onClick={() => {handleChangeOrderStatus({ id: order.id, status: order.estado})}}
                                            >
                                                <FiCheck size={16} color="#fff" />
                                            </button>
                                        </div>
                                    </div>
                                )) : filteredOrders.map(order => (
                                    <div className={`order ${expandedOrder === order.id && 'expanded'}`} key={order.id}>
                                        <div className="listName" id="listName" style={{width: '20%'}} >
                                            <p>{order.nome}</p>
                                            <p style={{ fontSize: 13 }}>
                                                <span style={{ color: order.meio_pagamento.toUpperCase() === 'PIX' ? '#00BDAE' : '#00BC64' }}>{order.meio_pagamento.toUpperCase()} </span> 
                                                {formatDate(order.created_at)}
                                            </p>

                                            <div className="expandedOrder">
                                                <span>Pedido</span>
                                                { 
                                                    renderItems(order.new_itens) 
                                                }

                                                <span>Obs.</span>
                                                <p>{order.observacao}</p>

                                                <span>Valor</span>
                                                <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.valor)}</p>
                                            </div>
                                        </div>
                                        <div id="listWhats" style={{width: '12%'}} >
                                            <a target="_blank" href={`https://wa.me/+55${order.whatsapp}`}>
                                                {order.whatsapp}
                                            </a>
                                            {expandedOrder === order.id ? (
                                                <button className="readMoreButton" onClick={() => handleReadMoreButton(order.id)}>
                                                    Ocultar <FiChevronUp size={14} />
                                                </button>
                                            ) : (
                                                <button className="readMoreButton" onClick={() => handleReadMoreButton(order.id)}>
                                                    Detalhes <FiChevronDown size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <p id="listOrder" style={{width: '25%'}} >
                                            { 
                                                renderItems(order.new_itens) 
                                            }
                                        </p>
                                        <p id="listObs" style={{width: '30%'}}>
                                            {order.observacao}
                                        </p>
                                        <p id="listPrice" style={{width: '10%'}} > 
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.valor)}
                                        </p>
                                        <div id="listStatus" style={{width: '3%'}}>
                                            <button 
                                                style={{backgroundColor: `${statusButtonColor(order.estado)}`}} 
                                                id="statusButton"
                                                onClick={() => {handleChangeOrderStatus({ id: order.id, status: order.estado})}}
                                            >
                                                <FiCheck size={16} color="#fff" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </Row>
            </div>
        </>
    );
}

export default Pedidos;