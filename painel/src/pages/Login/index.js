import React from 'react';
import { useHistory } from 'react-router-dom'
import api from '../../services/api';

import {Card, Form, Button, Alert} from 'react-bootstrap';

import './styles.css';

const Login = () =>{
    const history = useHistory();

    sessionStorage.removeItem('auth');

    async function signIn(){
        document.getElementById('errorAlert').style.display = 'none';
        const email = document.getElementById('emailInput').value;
        const senha = document.getElementById('senhaInput').value;

        const body = { 
            email:email,
            senha:senha
        };

        api.post('login', body).then(response =>{
            if(response.data.length > 0){
                sessionStorage.setItem('auth', response.data[0].id);
                if(response.data[0].admin){
                    history.push('/admin/menu-admin');
                } else{
                    history.push('/admin');
                }
                
            } else{
                document.getElementById('errorAlert').style.display = 'inherit';
                document.getElementById('senhaInput').value = "";
                document.getElementById('emailInput').value = "";
            }
        });

    }

    return(
        <div>
            <Alert variant="danger" className="errorAlert" id="errorAlert">
                Email ou senha incorretos!
            </Alert>
            <Card className="cardLogin">
                <h1>Login</h1>
                <Form className="loginForm" onSubmit={(e)=>{e.preventDefault(); signIn()}}>
                    <Form.Control type="text" id="emailInput" placeholder="Email"/>
                    <Form.Control type="password" id="senhaInput" placeholder="Senha"/>
                    <Button type="submit" className="loginButton" variant="success" >Entrar</Button>
                </Form>
            </Card>
        </div>
        
        
    );
}

export default Login;