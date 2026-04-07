// Arquivo responsável pela conexão com o banco de dados
import mysql from 'mysql';
import mysql2 from 'mysql2/promise.js';

import databaseConfig from '../configs/database.config.js';

const connection = mysql.createConnection(databaseConfig);
const asyncConnection = mysql2.createConnection(databaseConfig);

connection.connect((erro) => {
    if(erro){
        return console.log(erro);
    }
    const clientesTable = "CREATE TABLE IF NOT EXISTS `clientes` (\n"+
            "`id` int NOT NULL AUTO_INCREMENT,\n"+
            "`nome` varchar(150) NOT NULL,\n"+
            "`email` varchar(150) NOT NULL,\n"+
            "`senha` varchar(150) NOT NULL,\n"+
            "`admin` tinyint(1) DEFAULT 0,\n"+
            "`subdominio` varchar(150) NOT NULL,\n"+
            "`telefone` varchar(150) NULL,\n"+
            "`whatsapp` varchar(150) NULL,\n"+
            "`nome_empresa` varchar(150) NOT NULL,\n"+
            "`logo_empresa` varchar(150) NOT NULL,\n"+
            "`capa_cardapio` varchar(150) NOT NULL,\n"+
            "PRIMARY KEY (`id`)\n"+
            ") DEFAULT CHARSET=utf8;";
            
    const categoriasTable = "CREATE TABLE IF NOT EXISTS `categorias` (\n"+
            "`id` int NOT NULL AUTO_INCREMENT,\n"+
            "`cliente_id` int NOT NULL,\n"+
            "`nome` varchar(150) NOT NULL,\n"+
            "`descricao` varchar(300) NOT NULL,\n"+
            "`visivel` tinyint(1) DEFAULT 1,\n"+
            "PRIMARY KEY (`id`)\n"+
            ") DEFAULT CHARSET=utf8;";
            
    const itensTable = "CREATE TABLE IF NOT EXISTS `itens` (\n"+
            "`id` int NOT NULL AUTO_INCREMENT,\n"+
            "`categoria_id` int NOT NULL,\n"+
            "`nome` varchar(150) NOT NULL,\n"+
            "`descricao` varchar(300) NOT NULL,\n"+
            "`preco` float(10, 5) NOT NULL,\n"+
            "`imagem` varchar(150) NOT NULL,\n"+
            "`visivel` tinyint(1) DEFAULT 1,\n"+
            "PRIMARY KEY (`id`)\n"+
            ") DEFAULT CHARSET=utf8;";

    connection.query(clientesTable, (error, results, fields) => {
        if(error){
            return console.log(error);
        } 
        
        connection.query(categoriasTable, (error, results, fields) => {
            if(error){
                return console.log(error);
            } 

            connection.query(itensTable, (error, results, fields) => {
                if(error){
                    return console.log(error);
                }
            });
        });
    });
});

export default connection;
export {asyncConnection}