import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Row, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';

import api from '../../services/api';
import cepApi from '../../services/cepApi';
import imageApi from '../../services/imageApi';

import Select from 'react-select';
import Switch from 'react-flexible-switch';

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

import iphone from '../../assets/iphone.png';

import './styles.css'

const Configuracoes = () => {
    const history = useHistory();

    const [user, setUser] = useState({});
    const [logoImage, setLogoImage] = useState("");
    const [bannerImage, setBannerImage] = useState("");
    const [address, setAddress] = useState("");
    const [selectedPixOption, setSeletectedPixOption] = useState(); 
    const [pixOptions, setPixOptions] = useState([
        { label: "CPF", value: "CPF" },
        { label: "CNPJ", value: "CNPJ" },
        { label: "E-mail", value: "E-mail" },
        { label: "Número de celular", value: "Número de celular" },
        { label: "Chave aleatória", value: "Chave aleatória" },
    ]);

    if(!sessionStorage.getItem('auth')){
        history.push('/admin/login');
    }

    useEffect(() => {
        const userId = sessionStorage.getItem('auth');

        api.get(`clientes/${userId}`).then((response) => {
            const user = response.data[0];

            setUser(user);

            if (user.logo_empresa) {
                setLogoImage(user.logo_empresa);
            }

            if (user.capa_cardapio) {
                setBannerImage(user.capa_cardapio)
            }

            document.getElementById('name').value = user.nome_empresa || '';
            document.getElementById('category').value = user.categoria_empresa || '';
            document.getElementById('cep').value = user.CEP || '';
            document.getElementById('number').value = user.numero || '';
            document.getElementById('pixKey').value = user.chave_pix || '';
            document.getElementById('pixCopyPaste').value = user.pix_copia_cola || '';
            document.getElementById('whatsapp').value = user.whatsapp || '';
            
            if (user.CEP && user.CEP.length === 8) {
                cepApi.get(`${user.CEP}/json`).then((response) => {
                    const address = response.data.logradouro;
                    const district = response.data.bairro;
                    const city = response.data.localidade;
                    const uf = response.data.uf;

                    setAddress(`${address}, ${district}, ${city}, ${uf}`)
                });
            }
        })
    }, []);

    function handleChangeCEP() {
        const cep = document.getElementById('cep').value;

        if (cep && cep.length === 8) {
            cepApi.get(`${cep}/json`).then((response) => {
                const address = response.data.logradouro;
                const district = response.data.bairro;
                const city = response.data.localidade;
                const uf = response.data.uf;

                if (address) {
                    setAddress(`${address}, ${district}, ${city}, ${uf}`)
                } else {
                    setAddress('CEP não encontrado.')
                }
            });
        }else {
            setAddress('');
        }
    }

    function changeLogoImage(){
        if(document.getElementById('logoImage').files.length > 0){
            setLogoImage(URL.createObjectURL(document.getElementById('logoImage').files[0]));
        }
    }

    function changeBannerImage(){
        if(document.getElementById('bannerImage').files.length > 0){
            setBannerImage(URL.createObjectURL(document.getElementById('bannerImage').files[0]));
        }
    }

    function handleChangeAcceptPix(value) {
        const newUser = {
            ...user,
            aceitar_pix: value,
        }

        setUser(newUser);
    }

    function handleChangeAcceptWhatsapp(value) {
        const newUser = {
            ...user,
            aceitar_whatsapp: value,
        }

        setUser(newUser);
    }

    function handleRemoveLogoImage() {
        setLogoImage("");
    }
    
    function handleRemoveBannerImage() {
        setBannerImage("");
    }

    async function handleSaveForm() {
        document.getElementById('saveButton').setAttribute('disabled', true);
        document.getElementById('saveButton').innerText = 'salvando...';

        const userId = sessionStorage.getItem('auth');

        let logoResponse;

        if(document.getElementById('logoImage').files.length > 0 ){
            var body = new FormData();
    
            body.append('file', document.getElementById('logoImage').files[0]);
            body.append('upload_preset', 'cardapio');
            logoResponse = await imageApi.post('image/upload', body);
        }

        let bannerResponse;

        if(document.getElementById('bannerImage').files.length > 0 ){
            var body = new FormData();
            
            body.append('file', document.getElementById('bannerImage').files[0]);
            body.append('upload_preset', 'cardapio');
            bannerResponse = await imageApi.post('image/upload', body)
        }

        const nome_empresa = document.getElementById('name').value;
        const categoria_empresa = document.getElementById('category').value;
        const CEP = document.getElementById('cep').value;
        const numero = document.getElementById('number').value;
        const endereco = address;
        const tipo_chave_pix = selectedPixOption || "";
        const chave_pix = document.getElementById('pixKey').value;
        const pix_copia_cola = document.getElementById('pixCopyPaste').value;
        const aceitar_pix = !!user.aceitar_pix ? 1 : 0;
        const whatsapp = document.getElementById('whatsapp').value;
        const aceitar_whatsapp = !!user.aceitar_whatsapp ? 1 : 0;
        const logo_empresa = logoResponse
            ? logoResponse.data.url.replace('http', 'https')
            : user.logo_empresa;
        const capa_cardapio = bannerResponse
            ? bannerResponse.data.url.replace('http', 'https')
            : user.capa_cardapio;

        const data = {
            nome: "",
            email: "",
            senha: "",
            admin: "",
            subdominio: "",
            nome_empresa,
            categoria_empresa,
            CEP,
            numero,
            endereco,
            tipo_chave_pix,
            chave_pix,
            pix_copia_cola,
            aceitar_pix,
            whatsapp,
            aceitar_whatsapp,
            logo_empresa,
            capa_cardapio,
        }

        api.put(`clientes/${userId}`, data).then((response) => {
            if (response.data === "OK") {
                document.getElementById('saveButton').removeAttribute('disabled');
                document.getElementById('saveButton').innerText = 'Salvar';
                alert('Informações atualizadas com sucesso!');
            }else {
                alert('Houve um erro ao salvar, tente novamente mais tarde.');
            }
        });
    }

    return (
        <>
            <Sidebar />
            <Navbar />
            <div className="bodyContent">
                <Row>
                    <div className="col-2 space"></div>
                    <section className="configSection">
                        <section>
                            <h4>Configurações</h4>

                            <div className="uploadsContainer">
                                <div className="uploadItem">
                                    <span>Inserir Logo</span>

                                    <Form.File 
                                        style={{ display: 'none' }} 
                                        id="logoImage" 
                                        onChange={()=> changeLogoImage()} 
                                        custom 
                                    />
                                    { logoImage && (
                                        <div className="removeImageContainer">
                                            <button 
                                                className="removeImage"
                                                onClick={handleRemoveLogoImage}
                                            >
                                                <FiTrash2 color="#fff" size={16} />
                                            </button>
                                        </div>
                                    )}
                                    <label className="logoLabel" htmlFor="logoImage">
                                        { logoImage ? (
                                            <img src={logoImage} alt="" />
                                        ) : (
                                            <div className="uploadImage">
                                                <FiPlus size={56} color="#fff" />
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <div className="uploadItem">
                                    <span>Inserir Foto de Capa</span>

                                    <Form.File 
                                        style={{ display: 'none' }} 
                                        id="bannerImage" 
                                        onChange={()=> changeBannerImage()} 
                                        custom 
                                    />
                                    { bannerImage && (
                                        <div className="removeBannerContainer">
                                            <button 
                                                className="removeImage" 
                                                onClick={handleRemoveBannerImage}
                                            >
                                                <FiTrash2 color="#fff" size={16} />
                                            </button>
                                        </div>
                                    )}
                                    <label className="bannerLabel" htmlFor="bannerImage">
                                        { bannerImage ? (
                                            <img className="banner" src={bannerImage} alt="" />
                                        ) : (
                                            <div className="uploadImage banner">
                                                <FiPlus size={56} color="#fff" />
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </section>

                        <div className="configurationForm">
                            <span>Nome da sua empresa</span>

                            <input 
                                className="nameInput" 
                                type="text" 
                                placeholder="Digite o nome da empresa" 
                                id="name" 
                            />

                            <Select 
                                placeholder="Categoria da empresa" 
                                id="category" 
                                options={[]} 
                            />

                            <div className="address">
                                <div>
                                    <span>CEP</span>

                                    <input 
                                        type="text"
                                        placeholder="80730-808" 
                                        id="cep"
                                        onChange={handleChangeCEP}
                                    />
                                </div>

                                <div>
                                    <span>Número</span>

                                    <input type="text" placeholder="2222" id="number"/>
                                </div>
                            </div>
                            <p>{address}</p>
                        </div>
                    </section>
                    <section className="configSection">
                        <h4 style={{ textAlign: 'center' }}>Pré-Visualização</h4>

                        <div className="preview">
                            <img src={iphone} alt="" className="iphonePreview" />
                            { bannerImage && (
                                <div className="previewImageContainer">
                                    <img src={bannerImage} alt="Preview" />

                                    <h1>{user.nome_empresa}</h1>
                                </div>
                            )}
                        </div>

                        <div className="configurationForm">
                            <span>Pagamento via Pix</span>

                            <Select 
                                className="pixKeyType" 
                                placeholder="Tipo de chave" 
                                id="pixKeyType" 
                                options={pixOptions} 
                                onChange={event => setSeletectedPixOption(event.value)}
                            />

                            <input 
                                className="pixKey" 
                                type="text"
                                placeholder="Chave Pix" 
                                id="pixKey" 
                            />

                            <input 
                                type="text"
                                placeholder="Pix Copia e Cola" 
                                id="pixCopyPaste" 
                            />

                            <div className="switchContainer" >
                                <span>Aceitar pagamentos via Pix?</span>

                                <Switch 
                                    value={!!user.aceitar_pix}
                                    onChange={handleChangeAcceptPix}
                                    switchStyles={{ width: 40, height: 20, padding: 2 }}
                                    circleStyles={{ diameter: 20, onColor: '#00BC64' }}
                                />
                            </div>

                            <span>Seu Whatsapp</span>

                            <input 
                                className="whatsappInput" 
                                type="text" 
                                placeholder="Ex: +55 41 3333-3333" 
                                id="whatsapp"
                            />

                            <div className="switchContainer">
                                <span>Permitir pedidos por Whatsapp?</span>

                                <Switch 
                                    value={!!user.aceitar_whatsapp}
                                    onChange={handleChangeAcceptWhatsapp}
                                    switchStyles={{ width: 40, height: 20, padding: 2 }}
                                    circleStyles={{ diameter: 20, onColor: '#00BC64' }}
                                />
                            </div>
                        </div>
                    </section>
                    <section className="configSection">
                        <div className="saveButtonContainer">
                            <button id="saveButton" variant="success" className="saveButton" onClick={handleSaveForm}>Salvar</button>
                        </div>
                    </section>
                </Row>
            </div>
        </>
    );
}

export default Configuracoes;