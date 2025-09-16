import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { userData } from '../context/UserContext';
import { withSwalLoading, swalMensaje, swalMissing } from '../utils/SwalUtils';


function PreparacionA() {

    //Hooks
    const { user } = userData();
    // VARIABLES VACIAS PARA ESTADO INICIAL
    const formPrepA = {
        empresa: '',
        sede: ''
    }
    const [form, setForm] = useState(formPrepA);
    const [empresas, setEmpresas] = useState([]);
    const [sedes, setSedes] = useState([]);

    // Refs
    const empresaRef = useRef(null);
    const sedeRef = useRef(null);

    //Campos obligatorios
    const camposObligatorios = [
        { key: 'empresa', label: 'Empresa', ref: empresaRef },
        { key: 'sede', label: 'Sede', ref: sedeRef }
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
        <div className="page">
            <div className="panel">
                <h2>Adecuaci&oacute;n de preparaci&oacute;n</h2>
                <div className="content">
                    <div className="filter-container">
                        <Card>
                            <div className="p-fluid">
                                <div>
                                    <FloatLabel>
                                        <Dropdown
                                            value={form.empresa}
                                            placeholder="Seleccione Empresa"
                                            filter
                                            appendTo="self"
                                            onChange={e => {
                                                setSedes([]);
                                                setServicios([]);
                                                setForm(f => ({
                                                    ...f,
                                                    empresa: e.value,
                                                    sede: '',
                                                    servicio: ''
                                                }));
                                                setTimeout(() => sedeRef.current?.focus(), 150);
                                            }}
                                        />
                                        <label>Empresa</label>
                                    </FloatLabel>
                                </div>

                                <div>
                                    <FloatLabel>
                                        <Dropdown
                                            ref={sedeRef}
                                            options={sedes}
                                            placeholder="Seleccione "
                                            value={form.sede}
                                            appendTo="self"
                                            onChange={e => {
                                                setForm({ ...form, sede: e.value });
                                            }}
                                            filter
                                        />
                                        <label>Sede</label>
                                    </FloatLabel>
                                </div>

                                <div>
                                    <Button label="Consulta" icon="pi pi-search" className="btn-lg btn-success"  />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreparacionA;