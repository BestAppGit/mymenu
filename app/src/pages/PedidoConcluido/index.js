import React, { useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/CartHook';
import api from '../../services/api';

import whatsappIcon from '../../assets/whatsapp.png';

import './styles.css';

function PedidoConcluido() {
    const { totalValue, name } = useCart();
    
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
        });
    }, []);

    function handleCopyPixButton() {
        navigator.clipboard.writeText(cliente.pix_copia_cola);
    }

    function handleWhatsappButton() {
        window.open(`https://api.whatsapp.com/send?phone=+55${cliente.whatsapp}&text=Olá ${cliente.nome_empresa}! Me chamo ${name} e gostaria de confirmar meu pedido.`)
    }

    return (
        <div id="order_complete_container">
            <header>
                <Link to="/carrinho">
                    Voltar ao menu
                    <FiChevronRight size={16}></FiChevronRight>
                </Link>
            </header>
            <main>
                <h1>Obrigado pelo seu pedido!</h1>
                <p>Faça o pagamento via PIX.</p>

                <div className="line" />

                <div className="field">
                    <h3>Valor do Pedido</h3>

                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</span>
                </div>

                <div className="field">
                    <h3>Chave PIX 
                        {cliente.tipo_chave_pix && (
                            <> ({cliente.tipo_chave_pix})</>
                        )}
                    </h3>

                    <span>{cliente.chave_pix}</span>
                </div>

                {cliente.pix_copia_cola && (
                    <>
                        <div className="pix_copy_paste">
                            <h3>PIX Copia e Cola</h3>

                            <p>{cliente.pix_copia_cola}</p>
                        </div>

                        <div className="copy_pix">
                            <button 
                                className="copy_pix" 
                                onClick={handleCopyPixButton} 
                            >
                                Copiar PIX
                            </button>
                        </div>
                    </>
                )}

                <h2>Já efetuou o pagamento?</h2>
                <p>Envie-nos o comprovante</p>

                <button className="whatsapp_button" onClick={handleWhatsappButton}>
                    Enviar comprovante
                    <img src={whatsappIcon} alt="Whatsapp" />
                </button>
            </main>
        </div>
    );
}

export default PedidoConcluido;