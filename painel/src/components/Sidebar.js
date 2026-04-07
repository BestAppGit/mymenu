import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {Nav} from 'react-bootstrap';
import QRCode from 'qrcode.react';
import api from '../services/api';

import './Sidebar.css';

import {MdLibraryBooks, MdRestaurantMenu, MdSettings, MdAirplay, MdShoppingCart} from 'react-icons/md';
import {FaBars} from 'react-icons/fa';
 
const Sidebar = (props) => {
    const history = useHistory();

    if(!sessionStorage.getItem('auth')){
        history.push('/login');
    }

    const [linkUsuario, setLinkUsuario] = useState("");
    const [logoImage, setLogoImage] = useState("");

    function imprimir(){
        var dataUrl = document.getElementById('qrCodeImg').toDataURL();
        var windowContent = '<!DOCTYPE html>';
        windowContent += '<html>'
        windowContent += '<head><title>Imprimir QRCode</title>';
        windowContent += '<style>';
        windowContent += 'html{text-align: center;font-family: "Noto Sans TC", sans-serif; font-weight: 400; line-height: 1.5; text-decoration: none;}';
        windowContent += 'div{float: left; width: 30%; margin: 0; padding: 10px; border: dashed 1px black;}';
        windowContent += 'a{text-decoration:none; color: #000000; font-weight: 600 !important; margin: 0;}';
        windowContent += 'p{margin: 0;}';
        windowContent += 'h2{margin: 0; margin-bottom: 5px;}';
        windowContent += '</style>';
        windowContent += '</head>'
        windowContent += '<body>'
        windowContent += '<div>'
        windowContent += '<h2>Cardápio Online</h2>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '<p>OU ACESSE:</p>';
        windowContent += '<a href="https://'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '') + '">'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '')+ '</a></div>';
        windowContent += '<div>'
        windowContent += '<h2>Cardápio Online</h2>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '<p>OU ACESSE:</p>';
        windowContent += '<a href="https://'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '') + '">'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '')+ '</a></div>';
        windowContent += '<div>'
        windowContent += '<h2>Cardápio Online</h2>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '<p>OU ACESSE:</p>';
        windowContent += '<a href="https://'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '') + '">'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '')+ '</a></div>';
        windowContent += '<div>'
        windowContent += '<h2>Cardápio Online</h2>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '<p>OU ACESSE:</p>';
        windowContent += '<a href="https://'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '') + '">'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '')+ '</a></div>';
        windowContent += '<div>'
        windowContent += '<h2>Cardápio Online</h2>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '<p>OU ACESSE:</p>';
        windowContent += '<a href="https://'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '') + '">'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '')+ '</a></div>';
        windowContent += '<div>'
        windowContent += '<h2>Cardápio Online</h2>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '<p>OU ACESSE:</p>';
        windowContent += '<a href="https://'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '') + '">'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '')+ '</a></div>';
        windowContent += '<div>'
        windowContent += '<h2>Cardápio Online</h2>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '<p>OU ACESSE:</p>';
        windowContent += '<a href="https://'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '') + '">'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '')+ '</a></div>';
        windowContent += '<div>'
        windowContent += '<h2>Cardápio Online</h2>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '<p>OU ACESSE:</p>';
        windowContent += '<a href="https://'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '') + '">'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '')+ '</a></div>';
        windowContent += '<div>'
        windowContent += '<h2>Cardápio Online</h2>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '<p>OU ACESSE:</p>';
        windowContent += '<a href="https://'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '') + '">'+linkUsuario.replace('/categorias', '').replace(/[/]/g, '')+ '</a></div>';
        windowContent += '</body>';
        windowContent += '</html>';
        var printWin = window.open('','','');
        printWin.document.open();
        printWin.document.write(windowContent);
        printWin.document.close();
        printWin.focus();
        printWin.onload = ()=>{
            printWin.print();
        }
    }

    function toggleSidebar(){

        var sidebar = document.getElementById('sidebarComponent');
        sidebar.style.display = 'none';
        var sidebarcss = window.getComputedStyle(sidebar);
        if(sidebarcss.left === '-80%'){
            sidebar.style.display = 'inherit';
            sidebar.style.left = '0';
        } else{
            sidebar.style.display = 'inherit';
            sidebar.style.left = '-80%';
        }
    }

    useEffect(()=>{
        var link = "";
        if(window.location.href.split('https://').length > 1){
            link = window.location.href.split('https://')[1];
        } else{
            link = window.location.href.split('http://')[1];
        }
        if(link.split('.').length > 3){
            if(link.split('.')[link.split('.').length-1].includes('br')){
                link = link.split('.').slice(link.split('.').length-3).join('.');
            } else{
                link = link.split('.').slice(link.split('.').length-2).join('.');
            }
            
        }

        if(sessionStorage.getItem('auth')){
            api.get('clientes/'+sessionStorage.getItem('auth')).then(response=>{
                //console.log("CLiente atual: ", response);
                setLogoImage(response.data[0].logo_empresa);
                setLinkUsuario(response.data[0].subdominio +"."+ link.split('/')[0]);
            });
        }
        
    },[]);

    return(
        <div>
            <a href="#" className="hamburguerButton" onClick={()=>toggleSidebar()}><FaBars size={20}/> </a>
            <div className="sidebar" id="sidebarComponent">
                <Nav defaultActiveKey="/home" className="flex-column">
                    <Nav.Item>
                        
                        <h2><img src={logoImage} className="img-logo-sidebar" alt="LOGO"></img></h2>
                        <hr />
                    </Nav.Item>
                    <Nav.Item className="sidebarItem">
                        <Nav.Link as={Link} to="/admin/pedidos" className="sidebarLink">
                            <MdShoppingCart size={20} /> Pedidos
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="sidebarItem">
                        <Nav.Link as={Link} to="/admin/" className="sidebarLink">
                            <MdRestaurantMenu size={20} /> Produtos
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="sidebarItem">
                        <Nav.Link as={Link} to="/admin/categorias" className="sidebarLink">
                            <MdLibraryBooks size={20} /> Categorias
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="sidebarItem">
                        <Nav.Link as={Link} to="/admin/configuracoes" className="sidebarLink">
                            <MdSettings size={20} /> Configurações
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="sidebarItem">
                        <Nav.Link href={"https://"+linkUsuario} target="_blank" className="sidebarLink">
                            <MdAirplay size={20} /> Ver Online
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                
                <div className="meuQR">
                    <span>MEU QR</span>
                    <QRCode id="qrCodeImg" value={"https://"+linkUsuario} size={128} className="qrCode"/>
                    <button variant="danger" onClick={()=> imprimir()}>IMPRIMIR</button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;