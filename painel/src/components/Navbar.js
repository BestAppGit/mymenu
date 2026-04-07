import React, {useEffect, useState} from 'react';
import NavBar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useHistory } from 'react-router-dom';

import api from '../services/api';

import './Navbar.css';

import {FaSignOutAlt} from 'react-icons/fa';

const Navbar = () => {
    const history = useHistory();

    if(!sessionStorage.getItem('auth')){
        history.push('/admin/login');
    }

    function logout(){
        sessionStorage.removeItem('auth');
        history.push('/admin/login');
    }

    const [nomeCliente, setNomeCliente] = useState("");

    useEffect(()=>{
        if(sessionStorage.getItem('auth')){
            api.get('clientes/'+sessionStorage.getItem('auth')).then(response=>{
                setNomeCliente(response.data[0].nome);
            });
        }
    }, []);

    return (
        <NavBar fixed="top" className="navbar">
            <h3></h3>
            <Nav>
                <Nav.Item>
                    <Nav.Link onClick={()=> logout()}>
                        <h3 className="navbarLink"><FaSignOutAlt size={16} /> Sair</h3>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </NavBar>
    );
}

export default Navbar;