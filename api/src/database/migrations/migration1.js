import mysql from 'mysql';

import databaseConfig from '../../configs/database.config.js';

const connection = mysql.createConnection(databaseConfig);

connection.connect((erro) => {
    if(erro){
        return console.log(erro);
    }
    
    const alterTableItens = `ALTER TABLE itens 
        ADD COLUMN fixado boolean NOT NULL AFTER visivel,
        ADD COLUMN estoque int(6) AFTER preco,
        ADD COLUMN created_at timestamp DEFAULT CURRENT_TIMESTAMP AFTER fixado;`;

    const alterTableCategorias = `ALTER TABLE categorias
        ADD COLUMN weight int(6) NOT NULL AFTER visivel;`;

    const alterTableClientes = `ALTER TABLE clientes
        ADD COLUMN categoria_empresa varchar(50) AFTER nome_empresa,
        ADD COLUMN endereco varchar(50) AFTER categoria_empresa,
        ADD COLUMN CEP varchar(10) AFTER endereco,
        ADD COLUMN numero int(5) AFTER CEP,
        ADD COLUMN aceitar_pix boolean AFTER numero,
        ADD COLUMN tipo_chave_pix varchar(25) AFTER aceitar_pix,
        ADD COLUMN chave_pix varchar(255) AFTER tipo_chave_pix,
        ADD COLUMN pix_copia_cola varchar(255) AFTER chave_pix,
        ADD COLUMN aceitar_whatsapp boolean AFTER whatsapp;`;

    const createTablePedidos = `CREATE TABLE IF NOT EXISTS pedidos(
        id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
        cliente_id int NOT NULL,
        nome varchar(50) NOT NULL,
        meio_pagamento varchar(20) NOT NULL,
        whatsapp varchar(20) NOT NULL,
        itens varchar(255) NOT NULL,
        observacao varchar(255),
        valor decimal(10,2) DEFAULT 0 NOT NULL,
        estado varchar(20) DEFAULT 'preparing' NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        ) DEFAULT CHARSET=utf8;`;

    const createTableItensPedido = `CREATE TABLE IF NOT EXISTS itens_pedido (
        id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
        item_id int NOT NULL,
        pedido_id int NOT NULL,
        FOREIGN KEY (item_id) REFERENCES itens(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE CASCADE
        ) DEFAULT CHARSET=utf8;`;

    connection.query(alterTableItens, (error, results, fields) => {
        if(error){
            return console.log(error);
        } 
        connection.query(alterTableCategorias, (error, results, fields) => {
            if(error){
                return console.log(error);
            } 
            connection.query(alterTableClientes, (error, results, fields) => {
                if(error){
                    return console.log(error);
                } 
                connection.query(createTablePedidos, (error, results, fields) => {
                    if(error){
                        return console.log(error);
                    } 
                    connection.query(createTableItensPedido, (error, results, fields) => {
                        if(error){
                            return console.log(error);
                        } 

                        console.log('Migration executed successfully!');

                        process.exit();
                    });
                });
            });
        });
    });
});
