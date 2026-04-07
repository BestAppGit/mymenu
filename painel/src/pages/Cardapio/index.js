import React, {useState, useEffect} from 'react';
import api from '../../services/api';
import imageApi from '../../services/imageApi';
import { useHistory } from 'react-router-dom';
import { FiEdit2, FiSearch, FiTrash2 } from 'react-icons/fi'

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

import {Form, Row, Button, Card, Modal, InputGroup} from 'react-bootstrap';
import Switch from 'react-flexible-switch';
import Select from 'react-select';

import './styles.css';

const Cardapio = () =>{
    const history = useHistory();

    if(!sessionStorage.getItem('auth')){
        history.push('/admin/login');
    }

    const [itemImage, setItemImage] = useState('');

    const [itens, setItens] = useState([]);
    const [filteredItens, setFilteredItens] = useState([]);
    const [filter, setFilter] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [options, setOptions] = useState([]);

    const [selectedOption, setSelectedOption] = useState(-1);

    function getDados(){
        api.get('categorias',{
            headers: {
                'authorization' : sessionStorage.getItem('auth')
            }
        }).then(response =>{
            setCategorias(response.data);
            var aux = [];
            response.data.forEach(categoria =>{
                aux.push({
                    value: categoria.id,
                    label: categoria.nome
                });
            });
            setOptions(aux);
        }).then(()=>{
            api.get('itens',{
                headers: {
                    'authorization' : sessionStorage.getItem('auth')
                }
            }).then(response =>{
                setItens(response.data);
            });
        });
    }

    useEffect(() =>{
        if(sessionStorage.getItem('auth')){
            getDados();
        }
        
    },[document]);

    const [addItemModal, setaddItemModal] = useState(false);
    const [editItemModal, seteditItemModal] = useState(false);

    const [selectedItem, setSelectedItem] = useState(-1);

    function changeImgAdd(){
        if(document.getElementById('imagemAddItem').files.length > 0){
            setItemImage(URL.createObjectURL(document.getElementById('imagemAddItem').files[0]));
            document.getElementById('imagemAddText').style.display = 'none';
        } else{
            setItemImage("");
        }
    }

    function changeImgEdit(){
        if(document.getElementById('imagemEditItem').files.length > 0){
            setItemImage(URL.createObjectURL(document.getElementById('imagemEditItem').files[0]));
            document.getElementById('imagemEditText').style.display = 'none';
        } else{
            setItemImage("");
        }
    }

    function openEditItemModal(id){

        setSelectedItem(id);

        api.get('itens/'+id, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }
        }).then(response =>{
            setSelectedOption(response.data[0].categoria_id);
            seteditItemModal(true);

            document.getElementById('nomeEditItem').value = response.data[0].nome;
            document.getElementById('descricaoEditItem').value = response.data[0].descricao;
            document.getElementById('precoEditItem').value = response.data[0].preco;
            setItemImage(response.data[0].imagem);
            document.getElementById('imagemEditText').style.display = 'none';
            document.getElementById('estoqueEditItem').value = response.data[0].estoque;
            document.getElementById('fixarEditItem').checked = !!response.data[0].fixado;
        });

    }

    function editItem(){

        document.getElementById('editItemButton').setAttribute('disabled', true);
        document.getElementById('editItemButton').innerText = 'salvando...';

        const nome = document.getElementById('nomeEditItem').value;
        const descricao = document.getElementById('descricaoEditItem').value;
        const preco = parseFloat(document.getElementById('precoEditItem').value.replace(',', '.'));
        const estoque = document.getElementById('estoqueEditItem').value || 9999;
        const fixado = document.getElementById('fixarEditItem').checked ? 1 : 0;
        
        if(document.getElementById('imagemEditItem').files.length > 0){
            var data = new FormData();

            data.append('file', document.getElementById('imagemEditItem').files[0]);
            data.append('upload_preset', 'cardapio');

            imageApi.post('image/upload', data).then(res =>{
                var body = {
                    categoria_id: selectedOption,
                    nome: nome,
                    descricao: descricao,
                    preco: preco,
                    estoque: estoque,
                    fixado: fixado,
                    imagem: res.data.url.replace('http', 'https'),
                    visivel: ''
                }
        
                api.put('itens/'+selectedItem, body,{
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'authorization' : sessionStorage.getItem('auth')
                    }}).then(response =>{
                        getDados();
                        document.getElementById('editItemButton').removeAttribute('disabled');
                        document.getElementById('editItemButton').innerText = 'SALVAR';
                        setItemImage("");
                        document.getElementById('imagemEditText').style.display = '';
                        seteditItemModal(false);
                    });
            });
        } else{
            var body = {
                categoria_id: selectedOption,
                nome: nome,
                descricao: descricao,
                preco: preco,
                estoque: estoque,
                fixado: fixado,
                imagem: "",
                visivel: "",
            }
    
            api.put('itens/'+selectedItem, body,{
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'authorization' : sessionStorage.getItem('auth')
                }}).then(response =>{
                    getDados();
                    document.getElementById('editItemButton').removeAttribute('disabled');
                    document.getElementById('editItemButton').innerText = 'Salvar';
                    setItemImage("");
                    document.getElementById('imagemEditText').style.display = '';
                    seteditItemModal(false);
                }
            );
        }
    }

    async function addItem(){

        document.getElementById('addItemButton').setAttribute('disabled', true);
        document.getElementById('addItemButton').innerText = 'salvando...';

        if(selectedOption === -1 || 
            document.getElementById('nomeAddItem').value === "" ||
            document.getElementById('precoAddItem').value === ""
        ){
            alert('Campos inválidos! Favor preencher corretamente os campos.');
            document.getElementById('addItemButton').removeAttribute('disabled');
            document.getElementById('addItemButton').innerText = 'SALVAR';
        } else{
        
            if(document.getElementById('imagemAddItem').files.length > 0 ){
                var body = new FormData();
        
                body.append('file', document.getElementById('imagemAddItem').files[0]);
                body.append('upload_preset', 'cardapio');
                imageApi.post('image/upload', body).then(response =>{

                    var data = {
                        categoria_id: selectedOption,
                        nome: document.getElementById('nomeAddItem').value,
                        descricao: document.getElementById('descricaoAddItem').value,
                        preco: parseFloat(document.getElementById('precoAddItem').value.replace(',', '.')),
                        estoque: document.getElementById('estoqueAddItem').value || undefined,
                        fixado: document.getElementById('fixarAddItem').checked ? 1 : 0,
                        imagem: response.data.url.replace('http', 'https'),
                        visivel: 1
                    }    

                    api.post('itens', data, {
                        headers:{
                            'authorization': sessionStorage.getItem('auth')
                        }
                    }).then(response=>{
                        setSelectedOption(-1);
                        getDados();
                        document.getElementById('addItemButton').removeAttribute('disabled');
                        document.getElementById('addItemButton').innerText = 'SALVAR';
                        setItemImage("");
                        document.getElementById('imagemAddText').style.display = '';
                        setaddItemModal(false);
                    });
                    
                });
            } else{

                var data = {
                    categoria_id: selectedOption,
                    nome: document.getElementById('nomeAddItem').value,
                    descricao: document.getElementById('descricaoAddItem').value,
                    preco: parseFloat(document.getElementById('precoAddItem').value.replace(',', '.')),
                    estoque: document.getElementById('estoqueAddItem').value || undefined,
                    fixado: document.getElementById('fixarAddItem').checked ? 1 : 0,
                    imagem: "",
                    visivel: 1
                }    

                api.post('itens', data, {
                    headers:{
                        'authorization': sessionStorage.getItem('auth')
                    }
                }).then(response=>{
                    setSelectedOption(-1);
                    getDados();
                    document.getElementById('addItemButton').removeAttribute('disabled');
                    document.getElementById('addItemButton').innerText = 'SALVAR';
                    setItemImage("");
                    document.getElementById('imagemAddText').style.display = '';
                    setaddItemModal(false);
                });
            }
        }
    }

    function deleteItem(id){
        if (window.confirm('Tem certeza que deseja excluir o item?')) {
            let itemId;
            if (id) {
                itemId = id;
            }else {
                itemId = selectedItem;
            }
            api.delete(`itens/${itemId}`, {
                headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }}).then(response => {
                setSelectedItem(-1);
                getDados();
                seteditItemModal(false);
            });
        }
    }

    function filterItens() {
        const filter = document.getElementById('searchInputId').value.toLowerCase();
        const filterWithoutAccentuation = filter.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        
        if (filter !== '') {
            const newItens = itens.filter(item => {
                const itemName = item.nome.toLowerCase();
                const nameWithoutAccentuation = itemName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                if (nameWithoutAccentuation.includes(filterWithoutAccentuation)) {
                    return true;
                }
                return false;
            });
    
            setFilteredItens(newItens);
            setFilter(filter);
        }else {
            setFilteredItens([]);
            setFilter("");
        }
    }

    async function handleChangeItemVisibility(item) {
        const body = {
            categoria_id: '',
            nome: '',
            descricao: '',
            preco: '',
            imagem: '',
            estoque: '',
            fixado: '',
            visivel: item.visivel ? 0 : 1
        }

        api.put(`itens/${item.id}`, body, { 
            headers: {
                'Access-Control-Allow-Origin': '*',
                'authorization' : sessionStorage.getItem('auth')
            }
        }).then((response) => {
            if (response.data === 'OK') {
                let newItems = [...itens];

                let itemIndex = newItems.findIndex(itemMap => itemMap.id === item.id);
                
                newItems[itemIndex].visivel = body.visivel;
                
                setItens(newItems);
            }
        });
    }

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="bodyContent">
                <Row className="rowHeader">
                    <div className="col-2 space"></div>
                    <div className="header">
                        <h4>Produtos</h4>
                        <div className="searchInput">
                            <input id="searchInputId" onChange={()=> filterItens()} placeholder="Pesquise por nomes, preços e categorias"/>  

                            <button onClick={filterItens}>
                                <FiSearch size={16} color="#444"/>
                            </button>
                        </div>
                        <Button className="col-2" id="btnAddItem" variant="primary" onClick={() => setaddItemModal(true)}>Novo Produto</Button>
                    </div>
                </Row>
                <Row className="rowHeader">
                    <Card className="col-10 tableCardapio">
                        <div className="productsList">
                            <div className="listHeader">
                                <p style={{width: '15%'}} >Imagem</p>
                                <p style={{width: '25%'}} >Nome</p>
                                <p style={{width: '25%'}} >Categoria</p>
                                <p style={{width: '20%'}} >Preço</p>
                                <p style={{width: '15%', textAlign: 'end'}} >Ações</p>
                            </div>
                            <div className="products">
                                { filter.length === 0 ? itens.map(item => (
                                    <div className="product" key={item.id}>
                                        <div style={{width: '15%'}} >
                                            {item.imagem && (
                                                <img src={item.imagem} alt={item.nome} width="35px" height="35px" style={{marginLeft: 12, objectFit: "cover"}} />
                                            )}
                                        </div>
                                        <p style={{width: '25%'}} >
                                            {item.nome}
                                        </p>
                                        <p style={{width: '25%'}} >
                                            {categorias.find(cat => cat.id === item.categoria_id).nome}
                                        </p>
                                        <p style={{width: '20%'}} > 
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}
                                        </p>
                                        <div style={{width: '15%', display: 'flex', flex: 1, height: '35px', alignItems: 'center', justifyContent: 'flex-end'}}>
                                            <Switch 
                                                value={!!item.visivel}
                                                onChange={() => handleChangeItemVisibility(item)}
                                                switchStyles={{ width: 40, height: 20, padding: 2 }}
                                                circleStyles={{ diameter: 20, onColor: '#00BC64' }}
                                            />
                                            <button variant="success" className="editItemButton" onClick={() => openEditItemModal(item.id)}>
                                                <FiEdit2 size={16} color="#FFF" />
                                            </button>
                                            <button variant="success" className="deleteItemButton" onClick={() => deleteItem(item.id)}>
                                                <FiTrash2 size={16} color="#FFF" />
                                            </button>
                                        </div>
                                    </div>
                                )) : ( filteredItens.map(item => (
                                    <div className="product" key={item.id}>
                                        <div style={{width: '15%'}} >
                                            {item.imagem && (
                                                <img src={item.imagem} alt={item.nome} width="35px" height="35px" style={{marginLeft: 12, objectFit: "cover"}} />
                                            )}
                                        </div>
                                        <p style={{width: '25%'}} >
                                            {item.nome}
                                        </p>
                                        <p style={{width: '25%'}} >
                                            {categorias.find(cat => cat.id === item.categoria_id).nome}
                                        </p>
                                        <p style={{width: '20%'}} > 
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}
                                        </p>
                                        <div style={{width: '15%', display: 'flex', flex: 1, height: '35px', alignItems: 'center', justifyContent: 'flex-end'}}>
                                            <Switch 
                                                value={!!item.visivel}
                                                onChange={() => handleChangeItemVisibility(item)}
                                                switchStyles={{ width: 40, height: 20, padding: 2 }}
                                                circleStyles={{ diameter: 20, onColor: '#00BC64' }}
                                            />
                                            <button variant="success" className="editItemButton" onClick={() => openEditItemModal(item.id)}>
                                                <FiEdit2 size={16} color="#FFF" />
                                            </button>
                                            <button variant="success" className="deleteItemButton" onClick={() => deleteItem(item.id)}>
                                                <FiTrash2 size={16} color="#FFF" />
                                            </button>
                                        </div>
                                    </div>
                                )))}
                            </div>
                        </div>
                    </Card>
                </Row>
            </div>

            <Modal
                size="lg"
                show={addItemModal}
                centered
                onHide={() => {setaddItemModal(false); setItemImage("")}}
                >
                <Modal.Header closeButton className="modalHeader">
                    <Modal.Title>Adicionar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="addItemForm">
                        <Form.Row>
                            <div className="col-3 imageFormItem">
                                <div className="customFile">
                                    <img alt="" src={itemImage} />
                                    <span id="imagemAddText" className="customFileText">Clique para adicionar uma imagem</span>
                                    <Form.File id="imagemAddItem" className="customFileChild" onChange={()=> changeImgAdd()} custom />
                                </div>
                                
                            </div>
                            <div className ="col-9 contentFormItem">
                                <Form.Row>
                                    <Form.Control style={{ paddingLeft: 12, paddingRight: 12 }} type="text" id="nomeAddItem" placeholder="Digite aqui o nome do item" className="col-8 addItemInput"/>
                                    <InputGroup className="col-4 addItemInput">
                                        <InputGroup.Prepend className="prependInput">
                                            <InputGroup.Text>R$</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control type="number" id="precoAddItem" placeholder="Valor" className="valueInput"/>
                                    </InputGroup>
                                    
                                </Form.Row>
                                <Form.Row>
                                    <Form.Control as="textarea" rows="3" id="descricaoAddItem" placeholder="Breve descrição sobre o produto" className="addItemInput"/>
                                </Form.Row>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-3"></div>
                            <div className="lastRow">
                                <Select className="addItemInput categoriaAddItem" id="categoriaAddItem" placeholder="Categoria.." options={options} onChange={event=> setSelectedOption(event.value)} />
                                <div className="lastRowDiv">
                                    <span className="spanAddItem" >Estoque:</span>
                                    <Form.Control type="number" id="estoqueAddItem" placeholder="999" className="stockInput"/>
                                    <span className="spanAddItem" >Fixar no topo?</span>
                                    <label htmlFor="fixarAddItem">
                                        <Form.Control type="checkbox" id="fixarAddItem" className="fixarInput"/>
                                    </label>
                                </div>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-10"></div>
                            <button id="addItemButton" variant="success" className="col-2 addItemButton" onClick={() => addItem()}>Salvar</button>
                        </Form.Row>
                    </Form>
                </Modal.Body>
            </Modal> 
 
            <Modal
                size="lg"
                show={editItemModal}
                centered
                onHide={() => {seteditItemModal(false); setItemImage("")}}
            >
                <Modal.Header closeButton className="modalHeader">
                    <Modal.Title>Editar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="addItemForm">
                        <Form.Row>
                            <div className="col-3 imageFormItem">
                                <div className="customFile">
                                    <img alt="" src={itemImage} />
                                    <span id="imagemEditText" className="customFileText">Clique para adicionar uma imagem</span>
                                    <Form.File className="customFileChild" id="imagemEditItem" onChange={()=> changeImgEdit()} custom />
                                </div>
                                
                            </div>
                            <div className ="col-9 contentFormItem">
                                <Form.Row>
                                    <Form.Control style={{ paddingLeft: 12, paddingRight: 12 }} type="text" id="nomeEditItem" placeholder="Digite aqui o nome do item" className="col-8 addItemInput"/>
                                    <InputGroup className="col-4 addItemInput">
                                        <InputGroup.Prepend className="prependInput">
                                            <InputGroup.Text>R$</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control type="number" id="precoEditItem" placeholder="Valor" className="valueInput"/>
                                    </InputGroup>
                                    
                                </Form.Row>
                                <Form.Row>
                                    <Form.Control as="textarea" rows="3" id="descricaoEditItem" placeholder="Breve descrição sobre o produto" className="addItemInput"/>
                                </Form.Row>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-3"></div>
                            <div className="lastRow">
                                <Select className="addItemInput categoriaAddItem" id="categoriaEditItem" placeholder="Categoria.." value={options.filter(obj => obj.value === selectedOption)} options={options} onChange={event=> setSelectedOption(event.value)}/>
                                <div className="lastRowDiv">
                                    <span className="spanAddItem" >Estoque:</span>
                                    <Form.Control type="number" id="estoqueEditItem" placeholder="999" className="stockInput"/>
                                    <span className="spanAddItem" >Fixar no topo?</span>
                                    <label htmlFor="fixarEditItem">
                                        <Form.Control type="checkbox" id="fixarEditItem" className="fixarInput" value="1"/>
                                    </label>
                                </div>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-10"></div>
                            <button id="editItemButton" variant="success" className="col-2 addItemButton" onClick={() => editItem()}>Salvar</button>
                        </Form.Row>
                    </Form>
                </Modal.Body>
            </Modal>
            
        </div>
    );
}

export default Cardapio;