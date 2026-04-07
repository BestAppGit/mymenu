// Arquivo responsável por conter as funções de acesso ao banco de dados

import connection, { asyncConnection } from './connectionconfig.js';

// ------------------- FUNCOES DE CONTROLE DE CLIENTES ------------------------

// Busca um cliente no banco de acordo com email e senha;
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function login(response, body){
    const email = body['email'];
    const senha = body['senha'];

    var sql = "SELECT * FROM `clientes` WHERE `email`='"+email+"' AND `senha`='"+senha+"'";

    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.log(error);
        }
        response.json(results);
    });
}

// Busca os clientes no banco de dados;
// Caso o parâmetro id (padrão -1) for passado para a função, então apenas o cliente com o id passado é buscado
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function selectClientes(response, id=-1){
    var sql = '';
    if(id === -1){
        sql = "SELECT * FROM `clientes`";
    } else {
        if(isNaN(id)){
            sql = "SELECT * FROM `clientes` WHERE `subdominio`='"+id+"'";
        } else{
            sql = "SELECT * FROM `clientes` WHERE `id`="+id;
        }
        
    }

    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.log(error);
        }
        response.json(results);
    });
}

// Adiciona um cliente ao banco de dados
// Não é necessário o id, pois é auto-incrementado no BD
// Todos os dados do corpo são capturados (o tratamento de erros deve ser feito no frontend), e é feita a query no BD
// Caso seja concluída com sucesso, então o corpo enviado é retornado para confirmar que a ação foi executada
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function insertCliente(response, body){
    const nome = body['nome'];
    const email = body['email'];
    const senha = body['senha'];
    const admin = body['admin'];
    const subdominio = body['subdominio'];
    const nome_empresa = body['nome_empresa'];
    const logo_empresa = body['logo_empresa'];
    const capa_cardapio = body['capa_cardapio'];

    const sql = "INSERT INTO `clientes`(nome, email, senha, admin, subdominio, nome_empresa, logo_empresa, capa_cardapio) \n"+
    "VALUES('"+nome+"', '"+email+"', '"+senha+"', '"+admin+"', '"+subdominio+"','"+nome_empresa+"', '"+logo_empresa+"', '"+capa_cardapio+"')";

    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.log(error);
        }
        response.json(body);
    });
}

// Atualiza um cliente no banco de dados
// Os dados são opcionais, e há um tratamento para que somente os dados requisitados sejam mudados
// Caso seja concluída com sucesso, então um OK é retornado para confirmar que a ação foi executada
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function updateCliente(response, id, body){

    var sql = "UPDATE `clientes` SET ";

    const nome = body['nome'];
    if(nome !== ''){
        sql += " `nome`='"+nome+"'";
    }
    const email = body['email'];
    if(email !== ''){
        if(nome !== ''){
            sql += ',';
        }
        sql += " `email`='"+email+"'";
    }
    const senha = body['senha'];
    if(senha !== ''){
        if(email !== '' || nome !== ''){
            sql += ',';
        }
        sql += " `senha`='"+senha+"'";
    }
    const admin = body['admin'];
    if(admin !== ''){
        if(senha !== '' || email !== '' || nome !== ''){
            sql += ',';
        }
        sql += " `admin`="+admin+"";
    }
    const subdominio = body['subdominio'];
    if(subdominio !== ''){
        if(admin !== '' || senha !== '' || email !== '' || nome !== ''){
            sql += ',';
        }
        sql += " `subdominio`='"+subdominio+"'";
    }
    const nome_empresa = body['nome_empresa'];
    if(nome_empresa !== ''){
        if(subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== ''){
            sql += ',';
        }
        sql += " `nome_empresa`='"+nome_empresa+"'";
    }
    const logo_empresa = body['logo_empresa'];
    if(logo_empresa !== ''){
        if(nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== ''){
            sql += ',';
        }
        sql += " `logo_empresa`='"+logo_empresa+"'";
    }
    const capa_cardapio = body['capa_cardapio'];
    if(capa_cardapio !== ''){
        if(logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== ''){
            sql += ',';
        }
        sql += " `capa_cardapio`='"+capa_cardapio+"'";
    }
    const CEP = body['CEP'];
    if (CEP !== '') {
        if(logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== '' || capa_cardapio !== ''){
            sql += ',';
        }
        sql += " `CEP`='"+CEP+"'";
    }
    const endereco = body['endereco'];
    if (endereco !== '') {
        if(CEP !== '' || logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== '' || capa_cardapio !== ''){
            sql += ',';
        }
        sql += " `endereco`='"+endereco+"'";
    }
    const numero = body['numero'];
    if (numero !== '') {
        if(endereco !== '' || CEP !== '' || logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== '' || capa_cardapio !== ''){
            sql += ',';
        }
        sql += " `numero`='"+numero+"'";
    }
    const tipo_chave_pix = body['tipo_chave_pix'];
    if (tipo_chave_pix !== '') {
        if(CEP !== '' || numero !== '' || logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== '' || capa_cardapio !== ''){
            sql += ',';
        }
        sql += " `tipo_chave_pix`='"+tipo_chave_pix+"'";
    }
    const chave_pix = body['chave_pix'];
    if (chave_pix !== '') {
        if(CEP !== '' || numero !== '' || tipo_chave_pix !== '' || logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== '' || capa_cardapio !== ''){
            sql += ',';
        }
        sql += " `chave_pix`='"+chave_pix+"'";
    }
    const pix_copia_cola = body['pix_copia_cola'];
    if (pix_copia_cola !== '') {
        if(chave_pix !== '' || CEP !== '' || numero !== '' || tipo_chave_pix !== '' || logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== '' || capa_cardapio !== ''){
            sql += ',';
        }
        sql += " `pix_copia_cola`='"+pix_copia_cola+"'";
    }
    const aceitar_pix = body['aceitar_pix'];
    if (aceitar_pix !== '') {
        if(chave_pix !== '' || CEP !== '' || numero !== '' || tipo_chave_pix !== '' || pix_copia_cola !== '' || logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== '' || capa_cardapio !== ''){
            sql += ',';
        }
        sql += " `aceitar_pix`='"+aceitar_pix+"'";
    }
    const aceitar_whatsapp = body['aceitar_whatsapp'];
    if (aceitar_whatsapp !== '') {
        if(aceitar_pix !== '' || chave_pix !== '' || CEP !== '' || numero !== '' || tipo_chave_pix !== '' || pix_copia_cola !== '' || logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== '' || capa_cardapio !== ''){
            sql += ',';
        }
        sql += " `aceitar_whatsapp`='"+aceitar_whatsapp+"'";
    }
    const whatsapp = body['whatsapp'];
    if (whatsapp !== '') {
        if(aceitar_whatsapp !== '' || aceitar_pix !== '' || chave_pix !== '' || CEP !== '' || numero !== '' || tipo_chave_pix !== '' || pix_copia_cola !== '' || logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== '' || capa_cardapio !== ''){
            sql += ',';
        }
        sql += " `whatsapp`='"+whatsapp+"'";
    }
    const categoria_empresa = body['categoria_empresa'];
    if (categoria_empresa !== '') {
        if(whatsapp !== '' || aceitar_whatsapp !== '' || aceitar_pix !== '' || chave_pix !== '' || CEP !== '' || numero !== '' || tipo_chave_pix !== '' || pix_copia_cola !== '' || logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== '' || capa_cardapio !== ''){
            sql += ',';
        }
        sql += " `categoria_empresa`='"+categoria_empresa+"'";
    }

    var telefone = '';
    if('telefone' in body){
        telefone = body['telefone'];
        if(telefone !== ''){
            if(capa_cardapio !== '' || logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== ''){
                sql += ',';
            }
            sql += " `telefone`='"+telefone+"'";
        }
    }

    if('whatsapp' in body){
        const whatsapp = body['whatsapp'];
        if(whatsapp !== ''){
            if(telefone !== '' || capa_cardapio !== '' || logo_empresa !== '' || nome_empresa !== '' || subdominio !== '' || admin !== '' || senha !== '' || email !== '' || nome !== ''){
                sql += ',';
            }
            sql += " `whatsapp`='"+whatsapp+"'";
        }
    }

    sql += " WHERE `id`="+id;

    connection.query(sql, (error, results, fields) => {
        if (error) {
            return response.json("error");
        }
        response.json("OK");
    });
}


// Exclui um cliente do banco de dados
// Caso seja concluída com sucesso, então um OK é retornado para confirmar que a ação foi executada
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function deleteCliente(response, id){
    const sql = "DELETE FROM `clientes` WHERE `id`="+id;
    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.log(error);
        }
        response.json("OK");
    });
}


// ------------------- FUNCOES DE CONTROLE DE CATEGORIAS ------------------------


// Busca as categorias de determinado cliente no banco de dados;
// Caso o parâmetro id (padrão -1) for passado para a função, então apenas a categoria com o id passado é buscado
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function selectCategorias(response, idCliente, id=-1){
    var sql = '';
    if(id === -1){
        sql = "SELECT * FROM `categorias` WHERE `cliente_id`="+idCliente+" ORDER BY weight";
    } else {
        sql = "SELECT * FROM `categorias` WHERE `id`="+id;
    }

    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.log(error);
        }
        response.json(results);
        
    });
}

// Adiciona uma categoria ao banco de dados
// Não é necessário o id, pois é auto-incrementado no BD
// Todos os dados do corpo são capturados (o tratamento de erros deve ser feito no frontend), e é feita a query no BD
// Caso seja concluída com sucesso, então o corpo enviado é retornado para confirmar que a ação foi executada
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function insertCategoria(response, idCliente, body){
    const nome = body['nome'];
    const descricao = body['descricao'];

    const sql = `SELECT weight FROM categorias 
        WHERE cliente_id=? 
        ORDER BY weight DESC
        LIMIT 1`;

    connection.query(sql, [ idCliente ], (err, results, fields) => {
        if (err) {
            return console.log(err);
        }

        let weight = 0;

        if(results.length !== 0) {
            weight = results[0].weight + 1;
        }

        const sql = "INSERT INTO `categorias`(nome, descricao, cliente_id, weight) \n"+
        "VALUES('"+nome+"', '"+descricao+"', '"+idCliente+"', '"+weight+"')";
    
        connection.query(sql, (error, results, fields) => {
            if (error) {
                return console.log(error);
            }

            response.json({
                nome,
                descricao,
                weight,
            });
        });
    });
}

// Atualiza uma categoria no banco de dados
// Os dados são opcionais, e há um tratamento para que somente os dados requisitados sejam mudados
// Caso seja concluída com sucesso, então um OK é retornado para confirmar que a ação foi executada
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function updateCategoria(response, id, body){

    var sql = "UPDATE `categorias` SET ";

    const nome = body['nome'];
    if(nome !== ''){
        sql += " `nome`='"+nome+"'";
    }
    const descricao = body['descricao'];
    if(descricao !== ''){
        if(nome !== ''){
            sql += ",";
        }
        sql += " `descricao`='"+descricao+"'";
    }
    const visivel = body['visivel'];
    if(visivel !== ''){
        if(descricao !== '' || nome !== ''){
            sql += ",";
        }
        sql += " `visivel`='"+visivel+"'";
    }

    sql += " WHERE `id`="+id;

    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.log(error);
        }
        response.json("OK");
    });
}

function updateManyCategoriasWeight({ categorias, cliente_id }, response) {
    let sql = '';
    let variables = [];

    categorias.forEach(categoria => {
        sql += `UPDATE categorias SET weight=? WHERE id=?;`
        variables.push(categoria.weight, categoria.id);
    });

    connection.query(sql, variables, (err, results, fields) => {
        if (err) {
            return console.log(err);
        }

        sql = `SELECT * FROM categorias WHERE cliente_id=? ORDER BY weight;`;

        connection.query(sql, [ cliente_id ], (err, results, fields) => {
            if (err) {
                return console.log(err);
            }

            return response.json(results);
        });
    });
}

function updateCategoriaWeight({ id, new_weight, cliente_id }, response) {
    let sql = `SELECT id, weight FROM categorias WHERE weight=? AND cliente_id=?;`;

    connection.query(
        sql,
        [ new_weight, cliente_id ], 
        (err, results, fields) => {
            if (err) {
                return console.log(err);
            }

            if (results.length < 1) {

                sql = `UPDATE categorias SET weight=? WHERE id=?;
                    SELECT * FROM categorias WHERE cliente_id=? ORDER BY weight;`;
                
                connection.query(sql, [ new_weight, id, cliente_id ], (err, results, fields) => {
                    if (err) {
                        return console.log(err);
                    }
                   
                    return response.json(results[1]);
                });

            }else {

                const category_to_move_id = results[0].id;

                sql = `SELECT weight FROM categorias WHERE id=?;`;

                connection.query(sql, [ id ], (err, results, fields) => {
                    if (err) {
                        return console.log(err);
                    }

                    const current_weight = results[0].weight;

                    if (current_weight === new_weight) {
                        response.status(400);
                        return response.json({ err: "Nova posição é igual a anterior" });
                    }

                    sql = `UPDATE categorias SET weight=? WHERE id=?;
                        UPDATE categorias SET weight=? WHERE id=?;
                        SELECT * FROM categorias WHERE cliente_id=? ORDER BY weight;`;

                    connection.query(
                        sql,
                        [ new_weight, id, current_weight, category_to_move_id, cliente_id ],
                        (err, results, fields) => {
                            if (err) {
                                return console.log(err);
                            }

                            return response.json(results[2]);
                        }
                    )
                });
            }

            

            /* sql = `UPDATE categorias SET weight=? WHERE id=?, weight=? WHERE id=?;`;

            connection.query(sql, ) */
        }
    )
}

// Exclui uma categoria do banco de dados
// Caso seja concluída com sucesso, então um OK é retornado para confirmar que a ação foi executada
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function deleteCategoria(response, id){
    const sql = "DELETE FROM `categorias` WHERE `id`="+id;
    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.log(error);
        }
        response.json("OK");
    });
}


// ------------------- FUNCOES DE CONTROLE DE ITENS ------------------------


// Busca os itens de determinado cliente no banco de dados;
// Caso o parâmetro id (padrão -1) for passado para a função, então apenas o item com o id passado é buscado
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function selectItens(response, idCliente, id=-1){
    var sql = '';
    if(id === -1){
        sql = "SELECT `itens`.* FROM `itens`, `categorias` WHERE `categorias`.`cliente_id`="+idCliente+" AND `itens`.`categoria_id`=`categorias`.`id` ORDER BY fixado != 1, created_at DESC;";
    } else {
        sql = "SELECT * FROM `itens` WHERE `id`="+id;
    }

    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.log(error);
        }
        response.json(results);
        
    });

}

// Adiciona um item ao banco de dados
// Não é necessário o id, pois é auto-incrementado no BD
// Todos os dados do corpo são capturados (o tratamento de erros deve ser feito no frontend), e é feita a query no BD
// Caso seja concluída com sucesso, então o corpo enviado é retornado para confirmar que a ação foi executada
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function insertItem(response, body){
    const categoria_id = body['categoria_id'];
    const nome = body['nome'];
    const descricao = body['descricao'];
    const preco = body['preco'];
    const imagem = body['imagem'];
    const estoque = body['estoque'];
    const fixado = body['fixado'];

    if (fixado === true) {
        let sql = `SELECT id FROM itens WHERE fixado = 1 AND categoria_id=?`
        
        connection.query(sql, [ categoria_id ], (err, results, fields) => {
            if (err) {
                return console.log(err);
            }

            if (results.length > 0) {
                const item_id = results[0].id;

                sql = `UPDATE itens SET fixado=0 WHERE id=?`

                connection.query(sql, [ item_id ], (err, results, fields) => {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        });
    }

    let sql = "INSERT INTO `itens`(categoria_id, nome, descricao, preco, imagem, estoque, fixado) \n"+
    "VALUES('"+categoria_id+"', '"+nome+"', '"+descricao+"', '"+preco+"', '"+imagem+"', ?, '"+fixado+"')";
    
    connection.query(sql, [ estoque ? estoque : null ],(error, results, fields) => {
        if (error) {
            return console.log(error);
        }

        const item_id = results.insertId;

        sql = `SELECT * FROM itens WHERE id=?`

        connection.query(sql, [ item_id ], (err, results, fields) => {
            if (err) {
                return console.log(err);
            }

            response.json(results[0]);
        });
    });
}

// Atualiza um item no banco de dados
// Os dados são opcionais, e há um tratamento para que somente os dados requisitados sejam mudados
// Caso seja concluída com sucesso, então um OK é retornado para confirmar que a ação foi executada
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function updateItem(response, id, body){
    const fixado = body['fixado'];
    const categoria_id = body['categoria_id'];

    /* if (fixado === 1 || fixado === true) {
        let sql = `SELECT id, categoria_id FROM itens WHERE fixado = 1 AND categoria_id=?`
        
        connection.query(sql, [ categoria_id ], (err, results, fields) => {
            if (err) {
                return console.log(err);
            }

            if (results.length > 0) {
                const item_id = results[0].id;

                if (item_id !== id) {
                    sql = `UPDATE itens SET fixado=0 WHERE id=?`
    
                    connection.query(sql, [ item_id ], (err, results, fields) => {
                        if (err) {
                            return console.log(err);
                        }
                    });
                }
            }
        });
    } */

    var sql = "UPDATE `itens` SET ";

    if(categoria_id !== ''){
        sql += " `categoria_id`='"+categoria_id+"'";
    }
    const nome = body['nome'];
    if(nome !== ''){
        if(categoria_id !== ''){
            sql += ',';
        }
        sql += " `nome`='"+nome+"'";
    }
    const descricao = body['descricao'];
    if(descricao !== ''){
        if(nome !== '' || categoria_id !== ''){
            sql += ',';
        }
        sql += " `descricao`='"+descricao+"'";
    }
    const preco = body['preco'];
    if(preco !== ''){
        if(descricao !== '' || nome !== '' || categoria_id !== ''){
            sql += ',';
        }
        sql += " `preco`='"+preco+"'";
    }
    const imagem = body['imagem'];
    if(imagem !== ''){
        if(preco !== '' || descricao !== '' || nome !== '' || categoria_id !== ''){
            sql += ',';
        }
        sql += " `imagem`='"+imagem+"'";
    }
    const visivel = body['visivel'];
    if(visivel !== ''){
        if(imagem !== '' || preco !== '' || descricao !== '' || nome !== '' || categoria_id !== ''){
            sql += ',';
        }
        sql += " `visivel`='"+visivel+"'";
    }
    if (fixado !== '') {
        if(imagem !== '' || preco !== '' || descricao !== '' || nome !== '' || categoria_id !== '' || visivel !== ''){
            sql += ',';
        }
        sql += " `fixado`='"+fixado+"'";
    }
    const estoque = body['estoque'];
    if (estoque !== '') {
        if(imagem !== '' || preco !== '' || descricao !== '' || nome !== '' || categoria_id !== '' || visivel !== '' || fixado !== ''){
            sql += ',';
        }
        sql += " `estoque`='"+estoque+"'";
    }

    sql += " WHERE `id`="+id;
console.log(sql)
    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.log(error);
        }
        response.json("OK");
    });


}

// Exclui um item do banco de dados
// Caso seja concluída com sucesso, então um OK é retornado para confirmar que a ação foi executada
// A variavel response (variável de resposta do Express) é passada para que a resposta seja mandada por aqui
function deleteItem(response, id){
    const sql = "DELETE FROM `itens` WHERE `id`="+id;
    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.log(error);
        }
        response.json("OK");
    });
}


// ------------------- FUNCOES DE CONTROLE DE PEDIDOS ------------------------


async function createPedido({ cliente_id, nome, meio_pagamento, whatsapp, observacao, valor, itens }, response) {
    if (itens.length < 1) {
        return response.json({ err: 'Nenhum item adicionado.' });
    }

    const itensId = itens.map(item => item.id);
    let itensIdString = "";
    itens.map((item, index) => itensIdString += `${item.id}${index != itens.length -1 ? ",":""}`);

    let sql = `SELECT * FROM itens WHERE estoque IS NOT NULL AND id IN (?);`
    
    var [itensRows] = await (await asyncConnection).execute(`SELECT id,preco,nome FROM itens where id in (${itensIdString});`);

    connection.query(sql, [ itensId ], (err, results, fields) => {
        if (err) {
            return console.log(err);
        }
        if (results.length > 0) {
            sql = ``;
            let variables = [];
            
            let error;
    
            results.forEach(result => {
                itens.forEach(item => {
                    if (item.id === result.id) {
                        result.estoque--;
                    }
                });
    
                if (result.estoque < 0) {
                    error = 'Estoque insuficiente';
                }
    
                sql += `UPDATE itens SET estoque=? WHERE id=?;`;
                variables.push(result.estoque, result.id);
            });
    
            if (error) {
                return response.json(error);
            }

            connection.query(sql, variables, (err, results, fields) => {
                if (err) {
                    return console.log(err);
                }
            });
        }
        
        
        let nomeItens = '';
        let valorSomado = 0;

        itensRows.forEach(item => nomeItens += (`${item.nome}. `));
        itensRows.forEach(item => {
            let tempItem = itens.filter(propItem => propItem.id == item.id)[0];

            if(tempItem?.quantidade){
                valorSomado += (item.preco * tempItem.quantidade)
            }else{
                valorSomado += item.preco;
            }
        });

        let sql2 = `INSERT INTO pedidos(
            cliente_id, nome, meio_pagamento, whatsapp, itens, observacao, valor
        ) VALUES (?, ?, ?, ?, ?, ?, ?);`;

        connection.query(
            sql2, 
            [cliente_id, nome, meio_pagamento, whatsapp, nomeItens, observacao, valorSomado],
            (err, results, fields) => {
                if (err) {
                    return console.log(err);
                }

                const pedidoId = results.insertId;

                sql2 = `INSERT INTO itens_pedido(item_id, pedido_id, quantidade) VALUES `
                
                itens.forEach((item, index) => (
                    sql2 += (`${index !== 0 ? ',' : ''}(?, ${pedidoId}, ${item?.quantidade?item?.quantidade:1})`)
                ));

                sql2 += (';');
                
                connection.query(sql2, [...itensId], (err, results, fields) => {
                    if (err){
                        return console.log(err);
                    }

                    let sql2 = `SELECT * FROM pedidos where id=?;`;

                    connection.query(sql2, [ pedidoId ], (err, results, fields) => {
                        if (err){
                            return console.log(err);
                        }
                        if (results.length === 0) {
                            return response.json("Pedido não encontrado")
                        }
                
                        let pedidoResult = results[0];
                
                        sql2 = `SELECT * FROM itens_pedido
                            JOIN itens ON itens.id = itens_pedido.item_id
                            WHERE itens_pedido.pedido_id = ?`;
                
                        connection.query(
                            sql2,
                            [ pedidoId ],
                            (err, results, fields) => {
                                if (err)
                                    return console.log(err);
                
                                const pedido = {
                                    ...pedidoResult,
                                    itens: [
                                        ...results,
                                    ],
                                }
                
                                return response.json(pedido);
                            }
                        );
                    });
                });
            }
        )
    });
}

function showPedido(pedido_id, response) {
    let sql = `SELECT * FROM pedidos where id=?;`;
    
    connection.query(sql, [ pedido_id ], (err, results, fields) => {
        if (err){
            return console.log(err);
        }
        if (results.length === 0) {
            return response.json("Pedido não encontrado")
        }

        let pedidoResult = results[0];

        sql = `SELECT * FROM itens_pedido
            JOIN itens ON itens.id = itens_pedido.item_id
            WHERE itens_pedido.pedido_id = ?`;

        connection.query(
            sql,
            [ pedido_id ],
            (err, results, fields) => {
                if (err)
                    return console.log(err);

                const pedido = {
                    ...pedidoResult,
                    itens: [
                        ...results,
                    ],
                }

                return response.json(pedido);
            }
        );
    });
}

async function getClientePedidos(cliente_id, response) {
    const sql = `SELECT * FROM pedidos WHERE pedidos.cliente_id=${cliente_id} ORDER BY estado="preparing" DESC, created_at DESC;`;
    const sql2 = `SELECT itens.id,itens.nome,itens.preco, itens_pedido.quantidade FROM itens_pedido inner join itens on itens_pedido.item_id = itens.id where itens_pedido.pedido_id = `

    let [results] = await (await asyncConnection).execute(sql);

    for(let i =0; i < results.length;i++){
        let item = results[i];
        results[i]["new_itens"] = [];
        let [results2] = await (await asyncConnection).execute(sql2 + item.id);

        results[i]["new_itens"] =  results2
    }

    return response.json(results);
}

function updatePedidoEstado(pedido_id, estado, response) {
    const sql = `UPDATE pedidos SET estado=? WHERE id=?`;

    connection.query(
        sql,
        [ estado, pedido_id ],
        (err, results, fields) => {
            if (err) {
                return console.log(err);
            }

            return response.json("OK")
        }
    )
}


export default {
    login,
    selectClientes, insertCliente, deleteCliente, updateCliente,
    selectCategorias, insertCategoria, deleteCategoria, updateCategoria, updateCategoriaWeight, updateManyCategoriasWeight,
    selectItens, insertItem, deleteItem, updateItem,
    createPedido, showPedido, getClientePedidos, updatePedidoEstado
};    
