import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FilterMatchMode } from 'primereact/api';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchServicios, fetchEmpresas, fetchSedes, fetchColores, fetchQFs } from '../services/maestrosService';
import { withSwalLoading, swalMensaje, swalMissing } from '../utils/SwalUtils';
import { userData } from '../context/UserContext';
import '../styles/Produccion.css';

const Preparacion = () => {

    //Hooks
    const { user } = userData();
    const [form, setForm] = useState('');

    // Refs
    const empresaRef = useRef(null);
    const sedeRef = useRef(null);
    const servicioRef = useRef(null);

    //Campos obligatorios
    const camposObligatorios = [
        { key: 'empresa', label: 'Empresa', ref: empresaRef },
        { key: 'sede', label: 'Sede', ref: sedeRef },
        { key: 'servicio', label: 'Servicio', ref: servicioRef }
    ]

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        if (!user) return;
        setForm(f => ({
            ...f,
            empresa: user.empresa,
            sede: user.sede

        }));
    }, [user]);

    return (
        <div>
            <div className="page">
                <div className="panel">
                    <h2>Producci&oacute;n</h2>

                </div>
            </div>
        </div>
    );
};

export default Preparacion;