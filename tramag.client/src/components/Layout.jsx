import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import ayudaIcon from '../assets/icono_ayuda.png'
import alistIcon from '../assets/icono_alistamiento.png'
import solicitudIcon from '../assets/icono_solicitud.png'
import produccionIcon from '../assets/icono_produccion.png'
import adecuacionIcon from '../assets/icono_adecuacion.png'
import preparacionIcon from '../assets/icono_preparacion.png'
import controlIcon from '../assets/icono_control.png'
import reporteIcon from '../assets/icono_reporte.png'
import '../styles/Layout.css';



const Layout = ({ children }) => {
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    
    const menuItems = [
        {
            label: 'Ayuda',
            icon: <img src={ayudaIcon} alt="entrada" className="menu-icon"/>,
            items: [{
                label: 'Gu\u00edas qu\u00edmicas',
                command: () => window.location.href = '/guia-usuario'
            },
            {
                label: 'Maestros',
                items: [
                    {
                        label: 'Maestro 1',
                        command: () => window.location.href = '/maestro-productos'
                    },
                    {
                        label: 'Maestro 2',
                        command: () => window.location.href = '/maestro-productos'
                    }
                ]
            }
            ]
        },
        {
            label: 'Alistamiento', icon: <img src={alistIcon} alt="alistamiento" className="menu-icon" />,
            command: () => window.location.href = '/entrada',
            className: location.pathname === '/entrada'
                ? 'p-menuitem-active'
                : ''
        },
        { label: 'Solicitudes', icon: <img src={solicitudIcon} alt="Solicitud" className="menu-icon" />, command: () => window.location.href = '/solicitudes' },
        {
            label: 'Producci\u00f3n',
            icon: <img src={produccionIcon} alt="Produccion" className="menu-icon" />,
            items: [
                {
                    label: 'Producci\u00f3n',
                    command: () => (window.location.href = '/produccion'),
                },
                {
                    label: 'Revisi\u00f3n',
                    command: () => (window.location.href = '/revision'),
                }]
        },
        {
            label: 'Adecuaci\u00f3n',
            icon: <img src={adecuacionIcon} alt="Adecuacion" className="menu-icon" />,
            items: [
                {
                    label: 'Preparaci\u00f3n',
                    command: () => (window.location.href = '/preparacionA'),
                },
                {
                    label: 'Acondicionamiento',
                    command: () => (window.location.href = '/acondicionamiento'),
                },
                {
                    label: 'Calidad',
                    command: () => (window.location.href = '/calidad'),
                }
            ]
        },
        { label: 'Preparaci\u00f3n', icon: <img src={preparacionIcon} alt="Preparacion" className="menu-icon" />, command: () => window.location.href = '/preparacion' },
        {
            label: 'Control',
            icon: <img src={controlIcon} alt="Control" className="menu-icon" />,
            items: [
                {
                    label: 'Control de calidad',
                    command: () => (window.location.href = '/control-calidad'),
                },
                {
                    label: 'Control de proceso',
                    command: () => (window.location.href = '/control-proceso'),
                },
                {
                    label: 'Liberaci\u00f3n',
                    command: () => (window.location.href = '/liberacion'),
                }
            ]
        },
        { label: 'Reportes', icon: <img src={reporteIcon} alt="Reporte" className="menu-icon" />, command: () => window.location.href = '/reportes' },
    ];


    return (
        <div className="layout" >
            {/* Barra de navegación superior */}
            < Menubar model={menuItems} className="btn-succes-letter p-button-text" />
               

            {/* Contenedor principal de contenido */}
            <div className="layout-content" >
                {children}
            </div >

            {/* Pie de página opcional */}
            < footer className="layout-footer" >
                {new Date().getFullYear()} Trazabilidad Magistral V1.0.1
            </footer >
        </div >

    );
};

export default Layout;