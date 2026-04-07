import React, {useState, useEffect} from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import Switch from 'react-flexible-switch';

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

import './styles.css';

import { FiEdit2, FiSearch, FiTrash2 } from 'react-icons/fi';
import { FaBars } from 'react-icons/fa';
import {Form, Row, Button, Card, Modal} from 'react-bootstrap';

const Categorias = () =>{
    const history = useHistory();

    if(!sessionStorage.getItem('auth')){
        history.push('/admin/login');
    }

    const [editCategoriaVisivel, setEditCategoriaVisivel] = useState(false);

    const [selectedCategoria, setSelectedCategoria] = useState(-1);
    const [categorias, setCategorias] = useState([]);
    const [isOrdering, setIsOrdering] = useState(false);
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [filter, setFilter] = useState("");

    function getDados(){
        api.get('categorias',{
            headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }
        }).then(response =>{
            setCategorias(response.data);
        });
    }

    useEffect(() =>{
        if(sessionStorage.getItem('auth')){
            getDados();
        }
    },[document]);

    const [addCategoriaModal, setaddCategoriaModal] = useState(false);
    const [editCategoriaModal, seteditCategoriaModal] = useState(false);

    async function openEditCategoriaModal(id){

        setSelectedCategoria(id);

        api.get('categorias/'+id,{
            headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }
        }).then(response =>{
            if(response.data[0].visivel === 1){
                setEditCategoriaVisivel(true);
            } else{
                setEditCategoriaVisivel(false);
            }
            
            seteditCategoriaModal(true);

            document.getElementById('editCategoriaNome').value = response.data[0].nome;
            document.getElementById('editCategoriaDescricao').value = response.data[0].descricao;
        });

    }

    function editCategoria(){

        document.getElementById('editCategoriaButton').setAttribute('disabled', true);
        document.getElementById('editCategoriaButton').innerText = 'salvando..';

        const nome = document.getElementById('editCategoriaNome').value;
        const descricao = document.getElementById('editCategoriaDescricao').value;
        var visivel = 0;
        if(editCategoriaVisivel){
            visivel = 1;
        }

        const body = {
            nome: nome,
            descricao: descricao,
            visivel: visivel
        }

        api.put('categorias/'+selectedCategoria, body,{
            headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }}).then(response =>{
                getDados();
                document.getElementById('editCategoriaButton').removeAttribute('disabled');
                document.getElementById('editCategoriaButton').innerText = 'SALVAR';
                seteditCategoriaModal(false);
            });
    }

    function addCategoria() {

        document.getElementById('addCategoriaButton').setAttribute('disabled', true);
        document.getElementById('addCategoriaButton').innerText = 'salvando..';

        const nome = document.getElementById('addCategoriaNome').value;
        const descricao = document.getElementById('addCategoriaDescricao').value;

        if(nome === ""){
            alert('Campos inválidos! Favor preencher corretamente os campos.');
            document.getElementById('addCategoriaButton').removeAttribute('disabled');
            document.getElementById('addCategoriaButton').innerText = 'SALVAR';
        } else{
            const body = {
                nome: nome,
                descricao: descricao
            }
    
            api.post('categorias', body, {
                headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }}).then(response => {
                getDados();
                document.getElementById('addCategoriaButton').removeAttribute('disabled');
                document.getElementById('addCategoriaButton').innerText = 'SALVAR';
                setaddCategoriaModal(false);
            });
        }
        
    }

    function excluirCategoria(id){
        if (window.confirm('Tem certeza que deseja excluir o item?')) {
            api.delete('categorias/'+id, {
                headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }}).then(response => {
                getDados();
            })
        }
    }

    function filterCategorias() {
        const filter = document.getElementById('searchInputId').value.toLowerCase();
        const filterWithoutAccentuation = filter.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        
        if (filter !== '') {
            const newCategorias = categorias.filter(item => {
                const itemName = item.nome.toLowerCase();
                const nameWithoutAccentuation = itemName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                if (nameWithoutAccentuation.includes(filterWithoutAccentuation)) {
                    return true;
                }
                return false;
            });
    
            setFilteredCategorias(newCategorias);
            setFilter(filter);
        }else {
            setFilteredCategorias([]);
            setFilter("");
        }
    }

    async function handleChangeItemVisibility(categoria) {
        const body = {
            nome: "",
            descricao: "",
            visivel: categoria.visivel ? 0 : 1,
        }

        api.put(`categorias/${categoria.id}`, body, { 
            headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }
        }).then((response) => {
            if (response.data === 'OK') {
                let newCategorias = [...categorias];
                
                let categoriaIndex = newCategorias.findIndex(categoriaMap => categoriaMap.id === categoria.id);
                
                newCategorias[categoriaIndex].visivel = body.visivel;

                setCategorias(newCategorias);
            }
        });
    }

    function handleOrdenarButton() {
        setIsOrdering(true);
    }
    
    function handleSaveOrderButton() {
        const formattedCategorias = categorias.map((categoria, index) => {
            return {
                id: categoria.id,
                weight: index,
            }
        });

        const body = {
            categorias: formattedCategorias,
        }

        api.patch(`categorias/`, body, { 
            headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }
        }).then((response) => {
            if (response.status === 200) {
                setIsOrdering(false);
                setCategorias(response.data);
            }
        });
    }

    function handleOnDragEnd(result) {
        if (!result.destination) {
            return;
        }

        const categories = Array.from(categorias);

        const [reorderedCategory] = categories.splice(result.source.index, 1);

        categories.splice(result.destination.index, 0, reorderedCategory);

        setCategorias(categories)
    }

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="bodyContent">
                <Row className="rowHeader">
                    <div className="col-2 space"></div>
                    <div className="header">
                        <h4>Categorias</h4>
                        <div className="searchInput">
                            <input id="searchInputId" onChange={()=> filterCategorias()} placeholder="Pesquise por nomes, preços e categorias"/>  

                            <button onClick={filterCategorias}>
                                <FiSearch size={16} color="#444"/>
                            </button>
                        </div>
                        <button 
                            className="col-1 ordernarButton" 
                            style={{ display: isOrdering ? 'none' : 'flex' }}
                            onClick={handleOrdenarButton}
                        >
                            Ordenar
                        </button>
                        <Button className="col-2" id="btnAddItem" variant="primary" onClick={() => setaddCategoriaModal(true)}>Nova Categoria</Button>
                    </div>
                </Row>
                <Row className="rowHeader">
                    <Card className="col-10 tableCardapio">
                        <div className="categoriesList">
                            { isOrdering ? (
                                <div className="listHeader">
                                    <p style={{width: '5%'}}></p>
                                    <p style={{width: '20%'}}>Nome</p>
                                    <p style={{width: '75%'}}>Descrição</p>
                                </div>
                            ) : (
                                <div className="listHeader">
                                    <p style={{width: '25%'}}>Nome</p>
                                    <p style={{width: '60%'}}>Descrição</p>
                                    <p style={{width: '15%', textAlign: 'end'}}>Ações</p>
                                </div>
                            )}
                            { filter.length === 0 ? (
                                <>
                                    { isOrdering ? (
                                        <DragDropContext onDragEnd={handleOnDragEnd}>
                                            <Droppable droppableId="categories">
                                                {(provided) => (
                                                    <div className="categories" {...provided.droppableProps} ref={provided.innerRef}>
                                                        {categorias.map((categoria, index) => (
                                                            <Draggable key={categoria.id} draggableId={`${categoria.id}`} index={index}>
                                                                {(provided) => (
                                                                    <div className="category" {...provided.draggableProps} ref={provided.innerRef}>
                                                                        <div style={{width: '5%'}} {...provided.dragHandleProps}>
                                                                            <FaBars size={20} color="#0700DD"/>
                                                                        </div>
                                                                        <p style={{width: '20%'}} >
                                                                            {categoria.nome}
                                                                        </p>
                                                                        <p style={{width: '60%'}} >
                                                                            {categoria.descricao}
                                                                        </p>
                                                                        <div style={{width: '15%', display: 'flex', flex: 1, height: '35px', alignItems: 'center', justifyContent: 'flex-end'}}>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    ) : (
                                        <div className="categories">
                                            {categorias.map((categoria) => (
                                                <div className="category">
                                                    <p style={{width: '25%'}} >
                                                        {categoria.nome}
                                                    </p>
                                                    <p style={{width: '60%'}} >
                                                        {categoria.descricao}
                                                    </p>
                                                    <div style={{width: '15%', display: 'flex', flex: 1, height: '35px', alignItems: 'center', justifyContent: 'flex-end'}}>
                                                        <Switch 
                                                            value={!!categoria.visivel}
                                                            onChange={() => handleChangeItemVisibility(categoria)}
                                                            switchStyles={{ width: 40, height: 20, padding: 2 }}
                                                            circleStyles={{ diameter: 20, onColor: '#00BC64' }}
                                                        />
                                                        <button variant="success" className="editItemButton" onClick={() => openEditCategoriaModal(categoria.id)}>
                                                            <FiEdit2 size={16} color="#FFF" />
                                                        </button>
                                                        <button variant="success" className="deleteItemButton" onClick={() => excluirCategoria(categoria.id)}>
                                                            <FiTrash2 size={16} color="#FFF" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="categories">
                                    {filteredCategorias.map((categoria) => (
                                        <div className="category" >
                                            <div style={{width: '5%'}} >
                                            </div>
                                            <p style={{width: '20%'}} >
                                                {categoria.nome}
                                            </p>
                                            <p style={{width: '60%'}} >
                                                {categoria.descricao}
                                            </p>
                                            <div style={{width: '15%', display: 'flex', flex: 1, height: '35px', alignItems: 'center', justifyContent: 'flex-end'}}>
                                                <Switch 
                                                    value={!!categoria.visivel}
                                                    onChange={() => handleChangeItemVisibility(categoria)}
                                                    switchStyles={{ width: 40, height: 20, padding: 2 }}
                                                    circleStyles={{ diameter: 20, onColor: '#00BC64' }}
                                                />
                                                <button variant="success" className="editItemButton" onClick={() => openEditCategoriaModal(categoria.id)}>
                                                    <FiEdit2 size={16} color="#FFF" />
                                                </button>
                                                <button variant="success" className="deleteItemButton" onClick={() => excluirCategoria(categoria.id)}>
                                                    <FiTrash2 size={16} color="#FFF" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </Row>
                <Row className="rowHeader">
                    <div className="col-10"></div>
                    <button 
                        className="col-2 salvarOrdemButton"
                        style={{ display: isOrdering ? 'flex' : 'none'}}
                        onClick={handleSaveOrderButton}
                    >
                        Salvar
                    </button>
                </Row>
            </div>

            <Modal
                size="lg"
                show={addCategoriaModal}
                centered
                onHide={() => setaddCategoriaModal(false)}
                className="addCategoriaModal"
            >
                <Modal.Header closeButton className="modalHeader">
                    <Modal.Title>Adicionar Categoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="addCategoriaForm">
                        <Form.Control type="text" placeholder="Digite aqui a categoria" id="addCategoriaNome" className="addCategoriaInput"/>
                        <Form.Control as="textarea" rows="3" placeholder="Breve descrição" id="addCategoriaDescricao" className="addCategoriaInput"/>
                        <button id="addCategoriaButton" variant="success" className="addCategoriaInput salvarButton" onClick={() => addCategoria()}>Salvar</button>
                    </Form>
                </Modal.Body>
            </Modal> 
 
            <Modal
                size="lg"
                show={editCategoriaModal}
                centered
                onHide={() => seteditCategoriaModal(false)}
            >
                <Modal.Header closeButton className="modalHeader">
                    <Modal.Title >Editar Categoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="addCategoriaForm">
                        <Form.Control type="text" placeholder="Digite aqui a categoria" id="editCategoriaNome" className="editCategoriaInput"/>
                        <Form.Control as="textarea" rows="3" placeholder="Breve descrição" id="editCategoriaDescricao" className="editCategoriaInput"/>
                        <button id="editCategoriaButton" variant="success" className="editCategoriaInput salvarButton" onClick={() => editCategoria()}>Salvar</button>
                    </Form>
                </Modal.Body>
            </Modal>
            
        </div>
    );
}

export default Categorias;