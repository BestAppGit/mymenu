import express from 'express';
import routes from './routes.js';
import cors from 'cors';
/* import fs from 'fs';
import https from 'https'; */

// Cria uma instância do Express, módulo utilizado para lidar com as rotas
const app = express();

// Diz ao Express que a comunicação será feita por JSON
app.use(express.json());

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));

// Diz ao Express onde está localizado o arquivo de rotas

app.use(routes);

const options = {
  key: fs.readFileSync("../ssl/mymenu.server.bestapp.com.br-le.key", 'ascii'),
  cert: fs.readFileSync("../ssl/mymenu.server.bestapp.com.br-le.crt", 'ascii')
};

https.createServer(options, app).listen(8000);