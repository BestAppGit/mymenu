// Arquivo responsável por gerenciar as rotas do Express

import express from 'express';
import database from './database/databasecontroller.js';

const routes = express.Router();

// ------------------- ROTAS DE CONTROLE DE CLIENTES ------------------------

routes.post('/login', (request, response) =>{
    database.login(response, request.body);
});

// Buscar todos os clientes
routes.get('/clientes', (request, response) =>{
    
    database.selectClientes(response);
});

// Buscar um único cliente
routes.get('/clientes/:id', (request, response) =>{
    
    database.selectClientes(response, request.params.id);
});

// Adicionar um cliente
// Exemplo de corpo da chamada:
// {
//     "nome": "José Silva",
//     "email": "teste@gmail.com.br",
//     "senha": "Teste1234",
//     "nome_empresa": "Empresa",
//     "logo_empresa": "a.png", (path da imagem)
//     "capa_cardapio": "b.png", (path da imagem)
//     "link_cardapio": "ashuashua.html" (link do cardapio)
// }
routes.post('/clientes', (request, response) =>{
    
    database.insertCliente(response, request.body);
});

// Atualiza um cliente
// Exemplo de corpo da chamada (os valores são opcionais, podendo ficar vazios, porém as chaves -mesmo vazias- devem permanecer no JSON):
// {
//     "nome": "",
//     "email": "teste@gmail.com.br",
//     "senha": "",
//     "nome_empresa": "Empresa",
//     "logo_empresa": "", (path da imagem)
//     "capa_cardapio": "b.png", (path da imagem)
//     "link_cardapio": "ashuashua.html", (link do cardapio)
// "CEP": "",
// "endereco": "",
// "numero": "",
// "tipo_chave_pix": "",
// "chave_pix": "",
// "pix_copia_cola": "",
// "aceitar_pix": "",
// "aceitar_whatsapp": "",
// "whatsapp": "",
// "categoria_empresa": "",
// }
routes.put('/clientes/:id', (request, response) =>{
    
    database.updateCliente(response, request.params.id, request.body);
});

// Deletar um cliente do banco de dados
routes.delete('/clientes/:id', (request, response) =>{
    
    database.deleteCliente(response, request.params.id);
});


// ------------------- ROTAS DE CONTROLE DE CATEGORIAS ------------------------

// Buscar todas as categorias
// necessário header:
//     'Authorization' : id do cliente
routes.get('/categorias', (request, response) =>{
    const idCliente = request.header('authorization');
    
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        database.selectCategorias(response, idCliente);
    }
    
});

// Buscar uma única categoria
// necessário header:
//     'Authorization' : id do cliente
routes.get('/categorias/:id', (request, response) =>{
    response.header("Access-Control-Allow-Origin", "*");
    const idCliente = request.header('authorization');
    response.header("Access-Control-Allow-Headers", "Origin, X-Request-Width, Content-Type, Accept");
    const id = request.params.id;
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        database.selectCategorias(response, idCliente, id);
    }
    
});

// Adicionar uma categoria
// necessário header:
//     'Authorization' : id do cliente
// Exemplo de corpo da chamada:
// {
//     "nome": "Pizzas",
//      "descricao": "Grandes, médias, pequenas"
// }
routes.post('/categorias', (request, response) =>{
    
    const idCliente = request.header('authorization');
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        database.insertCategoria(response, idCliente, request.body);
    }
    
});

// Atualiza uma categoria
// necessário header:
//     'Authorization' : id do cliente
// Exemplo de corpo da chamada (os valores são opcionais, podendo ficar vazios, porém as chaves -mesmo vazias- devem permanecer no JSON):
// {
//     "nome": "Pizzas",
//      "descricao": "",
//      "visivel": 0
// }
routes.put('/categorias/:id', (request, response) =>{
    
    const idCliente = request.header('authorization');
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        database.updateCategoria(response, request.params.id, request.body);
    }
});

// Atualiza o peso de varias categorias.
// JSON example: 
// {
//     categorias: [
//         {
//             id: 1,
//             weight: 0,
//         }, 
//         {
//             id: 2,
//             weight: 1,
//         }
//     ]
// }
routes.patch('/categorias', (request, response) => {
    const { categorias } = request.body;

    const cliente_id = request.header('authorization');
    if (!cliente_id) {
        response.status(401);
        response.json("Not Authorized");
    }else {
        database.updateManyCategoriasWeight({ categorias, cliente_id }, response);
    }
});

// Atualiza o peso de uma categoria específica
// JSON example:
// {
//     new_weight: 1
// }
routes.patch('/categorias/:id', (request, response) => {
    const { id } = request.params;
    const { new_weight } = request.body;

    const cliente_id = request.header('authorization');
    if (!cliente_id) {
        response.status(401);
        response.json("Not Authorized");
    }else {
        database.updateCategoriaWeight({ id, new_weight, cliente_id }, response);
    }
});

// Deletar uma categoria do banco de dados
routes.delete('/categorias/:id', (request, response) =>{
    
    const idCliente = request.header('authorization');
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        database.deleteCategoria(response, request.params.id);
    }
});

// ------------------- ROTAS DE CONTROLE DE ITENS ------------------------

// Buscar todos os itens
// necessário header:
//     'Authorization' : id do cliente
routes.get('/itens', (request, response) =>{
    const idCliente = request.header('authorization');
    
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        
        database.selectItens(response, idCliente);
    }
    
});

// Buscar um único item
// necessário header:
//     'Authorization' : id do cliente
routes.get('/itens/:id', (request, response) =>{
    
    const idCliente = request.header('authorization');
    const id = request.params.id;
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        database.selectItens(response, idCliente, id);
    }
    
});

// Adicionar um item
// necessário header:
//     'Authorization' : id do cliente
// Exemplo de corpo da chamada:
// {
//     "categoria_id": 1,
//      "nome": "X-Tudo",
//      "descricao": "Cheio de coisa, altos recheios",
// 	    "preco": 17,
// 	    "imagem": "asahuuahhamb.png",
//      "visivel": 1 | 0,
//      "estoque": 100,
// }
routes.post('/itens', (request, response) =>{
    
    const idCliente = request.header('authorization');
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        database.insertItem(response, request.body);
    }
    
});

// Atualiza um item
// necessário header:
//     'Authorization' : id do cliente
// Exemplo de corpo da chamada (os valores são opcionais, podendo ficar vazios, porém as chaves -mesmo vazias- devem permanecer no JSON):
// {
//     "categoria_id": 1,
//      "nome": "X-Tudo",
//      "descricao": "",
// 	    "preco": 17,
// 	    "imagem": "",
//      "visivel": 1 | 0,
//      "estoque": 100,
// }
routes.put('/itens/:id', (request, response) =>{
    const idCliente = request.header('authorization');
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        database.updateItem(response, request.params.id, request.body);
    }
});

// Deletar um item do banco de dados
routes.delete('/itens/:id', (request, response) =>{
    
    const idCliente = request.header('authorization');
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        database.deleteItem(response, request.params.id);
    }
});

export default routes;


// ------------------- ROTAS DE CONTROLE DOS PEDIDOS ------------------------

// Cria um novo pedido.
// JSON example: 
// {
//     cliente_id: 0,
//     nome: "name",
//     meio_pagamento: "PIX" | "whatsapp",
//     whatsapp: "11912345678",
//     observacao: "obs",
//     valor: 99.90,
//     itens: [
//         {
//             id: 10,
//             nome: "Lanche",
//         }
//     ]
// }
routes.post('/pedidos', (request, response) => {
    const { cliente_id, nome, meio_pagamento, whatsapp, observacao, valor, itens } = request.body;

    database.createPedido({ 
        cliente_id, nome, meio_pagamento, whatsapp, observacao, valor, itens 
    }, response);
});

// Busca um pedido específico por ID.
routes.get('/pedidos/:id', (request, response) => {
    const { id } = request.params;

    database.showPedido(id, response);
});

// Busca todos os pedidos de um cliente.
routes.get('/pedidos', (request, response) => {
    const idCliente = request.header('authorization');
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        database.getClientePedidos(idCliente, response);
    }
});

// Atualiza o estado de um único pedido. 
// JSON example: 
// {
//   estado: "done" | "preparing" | "canceled"
// }
routes.patch('/pedidos/:id', (request, response) => {
    const { id } = request.params;
    const { estado } = request.body;

    const idCliente = request.header('authorization');
    if(!idCliente){
        response.status(401);
        response.json("Not Authorized");
    } else{
        database.updatePedidoEstado(id, estado, response);
    }
});