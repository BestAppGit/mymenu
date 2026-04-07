import mysql from 'mysql';

import databaseConfig from '../../configs/database.config.js';

const connection = mysql.createConnection(databaseConfig);

connection.connect((erro) => {
    if(erro){
        return console.log(erro);
    }

    const dropTableItensPedido = `DROP TABLE itens_pedido;`;

    const dropTablePedidos = `DROP TABLE pedidos;`;

    const dropColumnsClientes = `ALTER TABLE clientes
        DROP COLUMN categoria_empresa,
        DROP COLUMN endereco,
        DROP COLUMN CEP,
        DROP COLUMN numero,
        DROP COLUMN aceitar_pix,
        DROP COLUMN tipo_chave_pix,
        DROP COLUMN chave_pix,
        DROP COLUMN pix_copia_cola,
        DROP COLUMN aceitar_whatsapp;`;
    
    const dropColumnsCategorias = `ALTER TABLE categorias DROP COLUMN weight;`;

    const dropColumnsItens = `ALTER TABLE itens
        DROP COLUMN fixado,
        DROP COLUMN estoque,
        DROP COLUMN created_at;`;

    connection.query(dropTableItensPedido, (error, results, fields) => {
        if(error){
            return console.log(error);
        } 
        connection.query(dropTablePedidos, (error, results, fields) => {
            if(error){
                return console.log(error);
            } 
            connection.query(dropColumnsClientes, (error, results, fields) => {
                if(error){
                    return console.log(error);
                } 
                connection.query(dropColumnsCategorias, (error, results, fields) => {
                    if(error){
                        return console.log(error);
                    } 
                    connection.query(dropColumnsItens, (error, results, fields) => {
                        if(error){
                            return console.log(error);
                        } 

                        console.log('Migration reverted successfully!');

                        process.exit();
                    });
                });
            });
        });
    });
});
