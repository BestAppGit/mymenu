import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router';

import api from '../../services/api';

import {Card} from 'react-bootstrap';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

import './styles.css';

function App() {
  const history = useHistory();

  const [cliente, setCliente] = useState();
  const [categorias, setCategorias] = useState();
  const [itens, setItens] = useState();

  var link = '';
  if(window.location.href.includes('https')){
    link = window.location.href.split('https://')[1];
  } else{
    link = window.location.href.split('http://')[1]; 
  }
  
  useEffect(()=>{
    function getDados(){
      api.get('clientes/'+link.split('.')[0]).then(response1 =>{
        setCliente(response1.data[0]);
        document.getElementById('favicon').href = response1.data[0].logo_empresa;
        document.title = response1.data[0].nome_empresa;
        api.get('categorias',{
            headers: {
                'authorization' : response1.data[0].id
            }
        }).then(response2 =>{
            setCategorias(response2.data);
        });
  
        api.get('itens',{
            headers: {
                'authorization' : response1.data[0].id
            }
        }).then(response3 =>{
            setItens(response3.data);
        });
      });
    }
  
    getDados();
  }, [link]);

  function handleShowProduct(id) {
    history.push(`/produto/${id}`);
  }

  if(link.split('.').length > 1){
    if(cliente && categorias && itens){
      return (
        <div>
          <div className="bg"></div>
            <div className="brandImage" style={{background: 'linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0.25)), url('+cliente.capa_cardapio+') center', backgroundSize: '100%', backgroundRepeat: 'no-repeat'}}>
                <h1>{cliente.nome_empresa.toUpperCase()}</h1>
                {(cliente.telefone !== null && cliente.telefone !== '') &&
                  <a className="phoneHeader" href={"tel:"+cliente.telefone} target="_blank" rel="noopener noreferrer"><FaPhoneAlt size={20} /></a>
                }
                {(cliente.whatsapp != null && cliente.whatsapp !== '') &&
                  <a className="whatsappHeader" href={"https://api.whatsapp.com/send?phone="+cliente.whatsapp+"&text=Bem vindo ao "+cliente.nome_empresa+"! Como podemos ajudar?"} target="_blank" rel="noopener noreferrer"><FaWhatsapp size={30} /></a>
                }
                <img className="logoImage" alt={cliente.nome_empresa} src={cliente.logo_empresa} />
            </div>
            <div className="categoriasList">
            {categorias.map(categoria => {
              var temItensVisiveis = false;
              itens.filter(item => item.categoria_id === categoria.id).forEach(item =>{
                if(item.visivel === 1){
                  temItensVisiveis = true;
                }
              });
              if(categoria.visivel === 1 && temItensVisiveis){
                return (
                  <a key={categoria.id} href={'#'+categoria.id}>{categoria.nome}</a>
                );
              } else {
                return null;
              }
            })}
            </div>
  
            {categorias.map(categoria => {
              var temItensVisiveis = false;
              itens.filter(item => item.categoria_id === categoria.id).forEach(item =>{
                if(item.visivel === 1){
                  temItensVisiveis = true;
                }
              });
              if(categoria.visivel === 1 && temItensVisiveis){
                  return (
                      <section key={categoria.id} id={categoria.id}>
                          <h2>{categoria.nome}</h2>
                          {itens.filter(item => item.categoria_id === categoria.id).map(item =>{
                              if(item.visivel === 1){
                                  return (
                                      <Card key={item.id} className="itemCard" onClick={() => {handleShowProduct(item.id)}} >
                                          <h3>{item.nome}</h3>
                                          <p>{item.descricao}</p>
                                          <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}</span>
                                          {item.imagem && (
                                            <img alt={item.nome} src={item.imagem} />
                                          )}
                                      </Card>
                                  );
                              } else {
                                return null;
                              }
                          })}
                          
                      </section>
                  );
              }else {
                return null;
              }
            })}

            <footer>
              <a href="https://mymenu.bestapp.com.br">Contrate para sua empresa</a>
            </footer>
            {(cliente.whatsapp !== null && cliente.whatsapp !== '') &&
              <a className="whatsappLink" href={"https://api.whatsapp.com/send?phone="+cliente.whatsapp+"&text=Bem vindo ao "+cliente.nome_empresa+"! Como podemos ajudar?"} target="_blank" rel="noopener noreferrer"><FaWhatsapp size={40} /></a>
            }
        </div>
      );
    } else{
      return <h3 className="loadingScreen">Carregando...</h3>;
    }
  } else{
    return <h3>404<br />Not Found.</h3>
  }
}

export default App;
