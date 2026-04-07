import React, {useState, useEffect} from 'react';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';

import Switch from 'react-flexible-switch';
import NavBar from 'react-bootstrap/Navbar';
import {Form, Row, Button, Table, Card, Nav, Modal} from 'react-bootstrap';
import {FaSignOutAlt} from 'react-icons/fa';

import './styles.css';

const Admin = ()=>{
    const history = useHistory();
    const [clientes, setClientes] = useState([]);

    const [selectedCliente, setSelectedCliente] = useState(-1);

    const [editAdmin, setEditAdmin] = useState(false);
    const [addClienteModal, setaddClienteModal] = useState(false);
    const [editClienteModal, seteditClienteModal] = useState(false);

    useEffect(()=>{
        if(!sessionStorage.getItem('auth')){
            history.push('/admin/login');
        } else{
            api.get('clientes/'+sessionStorage.getItem('auth')).then(response =>{
                if(response.data.admin === 0){
                    history.push('/admin/');
                }
            });
        }
        getDados();
    }, []);

    function getDados(){
        api.get('clientes').then(response =>{
            setClientes(response.data);
        });
    }

    function logout(){
        sessionStorage.removeItem('auth');
        history.push('/admin/login');
    }

    function addCliente(){
        document.getElementById('addClienteButton').setAttribute('disabled', true);
        document.getElementById('addClienteButton').innerText = 'salvando..';

        const nome = document.getElementById('addClienteNome').value;
        const nome_empresa = document.getElementById('addClienteEmpresa').value;
        const email = document.getElementById('addClienteEmail').value;
        const senha = document.getElementById('addClienteSenha').value;
        const subdominio = document.getElementById('addClienteSubdominio').value;
        var admin = 0;
        if(editAdmin){
            admin = 1;
        }

        if(nome === "" || nome_empresa === "" || email === "" ||
            senha === "" || subdominio === ""){
            alert('Campos inválidos! Favor preencher corretamente os campos.');
            document.getElementById('addClienteButton').removeAttribute('disabled');
            document.getElementById('addClienteButton').innerText = 'SALVAR';
        } else{
            const body = {
                nome: nome,
                nome_empresa: nome_empresa,
                email: email,
                senha: senha,
                subdominio: subdominio,
                admin: admin
            }

            api.post('clientes', body).then(response => {
                getDados();
                document.getElementById('addClienteButton').removeAttribute('disabled');
                document.getElementById('addClienteButton').innerText = 'SALVAR';
                setaddClienteModal(false);
            });
        }
    }

    function excluirCliente(){
        api.delete('clientes/'+selectedCliente).then(response => {
            setSelectedCliente(-1);
            getDados();
            seteditClienteModal(false);
        })
    }

    function openEditClienteModal(id){
        setSelectedCliente(id);
        
        api.get('clientes/'+id).then(response =>{

            setEditAdmin(response.data[0].admin === 1);

            seteditClienteModal(true);
            document.getElementById('editClienteNome').value = response.data[0].nome;
            document.getElementById('editClienteEmpresa').value = response.data[0].nome_empresa;
            document.getElementById('editClienteEmail').value = response.data[0].email;
            document.getElementById('editClienteSenha').value = response.data[0].senha;
            document.getElementById('editClienteSubdominio').value = response.data[0].subdominio;
            
            
            
        });

    }

    function editCliente(){

        document.getElementById('editClienteButton').setAttribute('disabled', true);
        document.getElementById('editClienteButton').innerText = 'salvando..';

        const nome = document.getElementById('editClienteNome').value;
        const nome_empresa = document.getElementById('editClienteEmpresa').value;
        const email = document.getElementById('editClienteEmail').value;
        const senha = document.getElementById('editClienteSenha').value;
        const subdominio = document.getElementById('editClienteSubdominio').value;
        var admin = 0;
        if(editAdmin){
            admin = 1;
        }

        const body= {
            nome: nome,
            nome_empresa: nome_empresa,
            email: email,
            senha: senha,
            subdominio: subdominio,
            admin: admin,
            logo_empresa: "",
            capa_cardapio: ""
        }

        api.put('clientes/'+selectedCliente, body).then(response =>{
            getDados();
            document.getElementById('editClienteButton').removeAttribute('disabled');
            document.getElementById('editClienteButton').innerText = 'SALVAR';
            seteditClienteModal(false);
        });
    }

    function filterClientes(){
        const chave = document.getElementById('searchInput').value;
        const itens = Array.from(document.getElementsByClassName('clList'));
        itens.forEach(item =>{
            item.style.display = "none";
            if(item.innerHTML.toLowerCase().includes(chave.toLowerCase())){
                item.style.display = "";
            }
        });
        
    }

    if(clientes.length > 0){
        // console.log(clientes);
        return (
            <div className="adminMenu">
                <NavBar bg="dark" fixed="top" className="navbar">
                    <h3>Bem vindo, Administrador!</h3>
                    <Nav>
                        <Nav.Item>
                            <Nav.Link onClick={()=> logout()}>
                                <h3 className="navbarLink"><FaSignOutAlt size={20} /> Sair</h3>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </NavBar>
                <div className="bodyContent">
                    <Row className="rowTable">
                        <h4 className="col-3">Clientes</h4>
                        <Form.Control className="col-5" id="searchInput" placeholder="Digite para pesquisar..." onChange={() =>filterClientes()} />
                        <div className="col"></div>
                        <Button className="col-2" id="btnAddItem" variant="primary" onClick={()=>setaddClienteModal(true)} >Adicionar novo</Button>
                    </Row>
                    <Card className="tableClientes">
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Nome da Empresa</th>
                                        <th>Subdominio</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientes.map(cliente =>{
                                        if(cliente.admin){
                                            if(cliente.id === sessionStorage.getItem('auth')){
                                                return(
                                                    <tr className="clList" key={cliente.id}>
                                                        <td>{cliente.nome} <sub><b>você</b></sub></td>
                                                        <td>{cliente.email}</td>
                                                        <td>{cliente.nome_empresa}</td>
                                                        <td>{cliente.subdominio}</td>
                                                        <td><Button variant="success" className="editButton" onClick={()=>openEditClienteModal(cliente.id)} >editar</Button></td>
                                                    </tr>
                                                );
                                            } else{
                                                return(
                                                    <tr className="clList" key={cliente.id}>
                                                        <td>{cliente.nome} <sub><b>admin</b></sub></td>
                                                        <td>{cliente.email}</td>
                                                        <td>{cliente.nome_empresa}</td>
                                                        <td>{cliente.subdominio}</td>
                                                        <td><Button variant="success" className="editButton" onClick={()=>openEditClienteModal(cliente.id)} >editar</Button></td>
                                                    </tr>
                                                );     
                                            }
                                        } else{
                                            return(
                                                <tr className="clList" key={cliente.id}>
                                                    <td>{cliente.nome}</td>
                                                    <td>{cliente.email}</td>
                                                    <td>{cliente.nome_empresa}</td>
                                                    <td>{cliente.subdominio}</td>
                                                    <td><Button variant="success" className="editButton" onClick={()=>openEditClienteModal(cliente.id)} >editar</Button></td>
                                                </tr>
                                            );
                                        }
                                    })}
                                    
                                </tbody>
                            </Table>
                        </Card>
                </div>

                <Modal
                    size="lg"
                    show={addClienteModal}
                    centered
                    onHide={() => setaddClienteModal(false)}
                    className="addClienteModal"
                >
                    <Modal.Header closeButton className="addClienteHeader">
                    <Modal.Title>Adicionar Cliente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="addClienteForm">
                            <Form.Row>
                                <Form.Control type="text" placeholder="Digite aqui o nome" id="addClienteNome" className="col-6 addClienteInput"/>
                                <Form.Control type="text" placeholder="Digite aqui a empresa" id="addClienteEmpresa" className="col-6 addClienteInput"/>
                            </Form.Row>
                            <Form.Row>
                                <Form.Control type="email" placeholder="Digite aqui o email" id="addClienteEmail" className="col-6 addClienteInput"/>
                                <Form.Control type="password" placeholder="Digite aqui a senha" id="addClienteSenha" className="col-6 addClienteInput"/>
                            </Form.Row>
                            <Form.Row>
                                <Form.Control type="text" placeholder="Digite aqui o subdominio" id="addClienteSubdominio" className="col-6 addClienteInput"/>
                                <div className="col-6">
                                    <Form.Row style={{marginTop: "15px"}}>
                                        <span className="col-10">Administrador?</span>
                                        <Switch 
                                            value={editAdmin}
                                            onChange={() => setEditAdmin(!editAdmin)}
                                            switchStyles={{ width: 50, height:20 }}
                                            circleStyles={{ diameter: 20 }}
                                            className="col-2"
                                        />
                                    </Form.Row>
                                </div>
                            </Form.Row>
                            <Button id="addClienteButton" variant="success" className="addClienteInput salvarButton" onClick={() => addCliente()} >SALVAR</Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal
                    size="lg"
                    show={editClienteModal}
                    centered
                    onHide={() => seteditClienteModal(false)}
                    className="editClienteModal"
                >
                    <Modal.Header closeButton className="editClienteHeader">
                    <Modal.Title>Adicionar Cliente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="editClienteForm">
                            <Form.Row>
                                <Form.Control type="text" placeholder="Digite aqui o nome" id="editClienteNome" className="col-6 editClienteInput"/>
                                <Form.Control type="text" placeholder="Digite aqui a empresa" id="editClienteEmpresa" className="col-6 editClienteInput"/>
                            </Form.Row>
                            <Form.Row>
                                <Form.Control type="email" placeholder="Digite aqui o email" id="editClienteEmail" className="col-6 editClienteInput"/>
                                <Form.Control type="password" placeholder="Digite aqui a senha" id="editClienteSenha" className="col-6 editClienteInput"/>
                            </Form.Row>
                            <Form.Row>
                                <Form.Control type="text" placeholder="Digite aqui o subdominio" id="editClienteSubdominio" className="col-6 editClienteInput"/>
                                <div className="col-6">
                                    <Form.Row style={{marginTop: "15px"}}>
                                        <span className="col-10">Administrador?</span>
                                        <Switch 
                                            value={editAdmin}
                                            onChange={() => setEditAdmin(!editAdmin)}
                                            switchStyles={{ width: 50, height:20 }}
                                            circleStyles={{ diameter: 20 }}
                                            className="col-2"
                                        />
                                    </Form.Row>
                                </div>
                            </Form.Row>
                            <Button id="editClienteButton" variant="success" className="editClienteInput salvarButton" onClick={() => editCliente()} >SALVAR</Button>
                            <Form.Row>
                                <div className="col-10"></div>
                                <Nav.Link className="col-2 linkExcluirCliente" onClick={() => excluirCliente()}>excluir cliente</Nav.Link>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                </Modal> 
            </div>
        );
    } else {
        getDados();
        return <h1 className="loadingScreen">Carregando, aguarde...</h1>;
    }
    
}

export default Admin;