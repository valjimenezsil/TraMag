import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchEmpresas, fetchSedes } from '../../services/maestrosService';
import { fetchServiciosExt } from '../../services/solicitudesService';
import { fetchOrdDeProdExt } from '../../services/reporteService';
import { withSwalLoading, swalMensaje, swalMissing } from '../../utils/SwalUtils';
import { userData } from '../../context/UserContext';
import '../../styles/Reportes.css';





const ReporteOrdenDeProd = () => {

    //HOOKS
    const { user } = userData();

    // VARIABLES VACIAS PARA ESTADO INICIAL
    const formOrdenDeProd = {
        servicio: '',
        empresa: '',
        sede: '',
        fecha: ''
    }

    const [form, setForm] = useState([formOrdenDeProd]);
    const [servicios, setServicios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [lista, setLista] = useState([]);
    const [emptyMess, setEmptyMess] = useState('Sin informaci\u00F3n');

    // Refs
    const empresaRef = useRef(null);
    const sedeRef = useRef(null);
    const servicioRef = useRef(null);

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        if (!user) return;
        setForm(f => ({
            ...f,
            empresa: user.empresa,
            sede: user.sede

        }));
    }, [user]);

    // Cargar datos iniciales al montar el componente
    useEffect(() => {
        const loadAll = async () => {
            withSwalLoading('Cargando informaci\u00F3n')
            try {
                // Solo cargamos empresas
                const empresasMapped = await fetchEmpresas();
                setEmpresas(empresasMapped);

                // Si ya vino empresa, cargar sedes y servicios
                if (form.empresa) {
                    const sedesMapped = await fetchSedes(form.empresa);
                    setSedes(sedesMapped);
                    Swal.close();
                }
                if (form.empresa && form.sede) {
                    const serviciosMapped = await fetchServiciosExt(form.empresa, form.sede);
                    setServicios(serviciosMapped);
                    Swal.close(setTimeout(() => servicioRef.current?.focus(), 100))
                }

            } catch (err) {
                swalMensaje('warning', err.message)
            }
        };

        loadAll();
    }, [form.empresa, form.sede]);

    //Campos obligatorios
    const camposObligatorios = [
        { key: 'empresa', label: 'Empresa', ref: empresaRef },
        { key: 'sede', label: 'Sede', ref: sedeRef },
        { key: 'servicio', label: 'Servicio', ref: servicioRef },
        { key: 'fecha', label: 'Fecha', ref: servicioRef }
    ]

    //HANDLERS
    const handleSearch = async () => {
        const faltantes = camposObligatorios
            .filter(c => !form[c.key] || String(form[c.key]).trim() === '');

        const labels = faltantes.map(c => c.label).join(', ');
        const primer = faltantes[0];

        if (faltantes.length > 0) {
            swalMissing(labels, primer)
            return;
        }
        withSwalLoading('Cargando informaci\u00F3n')
        try {
            const data = await fetchOrdDeProdExt(form.empresa, form.sede, form.servicio, form.fecha);

            if (data === 0) {
                Swal.close();
                setLista([]);
                setEmptyMess('No se encontraron \u00F3rdenes')
                setTimeout(swalMensaje('info', 'B\u00FAsqueda exitosa, pero no se encontraron \u00F3rdenes para esos filtros'), 200);

                return;
            }

            setLista(data);
            Swal.close();

        } catch (err) {
            swalMensaje('error', 'Error cargando datos: ' + err.message);
        }
    }

    //TABLA
    const rendertabla = () => (
        <div className="tabla-container">
            <DataTable
                scrollHeight="330px"
                scrollable
                value={lista}
                tableStyle={{ tableLayout: 'fixed' }}
                emptyMessage={emptyMess}
            >
                <Column field="Medicamento" header="Medicamento" style={{ width: '400px' }} />
                <Column field="Dosis" header="Dosis Unitaria" style={{ width: '180px' }} />
                <Column field="Cantidad" header="# de dosis" style={{ width: '150px' }} />

            </DataTable>
        </div>
    );

    return (
        <div>
            <div className="content" >
                <div className="btn-group flex-wrap">
                    <Button label="Consulta" icon="pi pi-search" className="btn-lg btn-success" onClick={handleSearch} />
                    <Button label="Limpiar" icon="pi pi-trash" className="btn-lg btn-success" />
                    <Button label="Agregar" icon="pi pi-file-plus" className="btn-lg btn-success" disabled />
                    <Button label="Guardar" icon="pi pi-save" className="btn-lg btn-success" disabled />
                    <Button label="Exportar" icon="pi pi-file-export" className="btn-lg btn-success" />
                </div>


                <div className="filter-container">
                    <Card>
                        <div className="p-fluid gridRepOrdProd">
                            {/*Empresa*/}
                            <div className="p-field">
                                <FloatLabel>
                                    <Dropdown
                                        id="empresa"
                                        ref={empresaRef}
                                        optionLabel="label"
                                        optionValue="value"
                                        options={empresas}
                                        value={form.empresa}
                                        placeholder="Seleccione Empresa"
                                        filter
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
                            {/*Sede*/}
                            <div className=" p-field ">
                                <FloatLabel>
                                    <Dropdown
                                        id="sede"
                                        ref={sedeRef}
                                        options={sedes}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Seleccione "
                                        value={form.sede}
                                        onChange={e => {
                                            setForm({ ...form, sede: e.value });
                                            setTimeout(() => servicioRef.current?.focus(), 150);
                                        }}
                                        filter
                                    />
                                    <label>Sede</label>
                                </FloatLabel>
                            </div>
                            {/*Servicio*/}
                            <div className="p-field">
                                <FloatLabel>
                                    <Dropdown
                                        id="servicio"
                                        ref={servicioRef}
                                        className={!form.sede || form.sede === '' ? 'dropdown-bloqueado' : ''}
                                        options={servicios}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Seleccione"
                                        value={form.servicio}
                                        appendTo={typeof window !== 'undefined' ? document.body : null}
                                        onChange={e => setForm(f => ({ ...f, servicio: e.value }))}
                                        filter
                                        disabled={!form.sede || form.sede === ''}
                                    />
                                    <label>Servicio</label>
                                </FloatLabel>
                            </div>
                            {/*Fecha*/}
                            <div className="p-field ">
                                <FloatLabel>
                                    <Calendar
                                        dateFormat="yy-mm-dd"
                                        value={form.fecha}
                                        appendTo={typeof window !== 'undefined' ? document.body : null}
                                        onChange={e => setForm(f => ({ ...f, fecha: e.value }))} dateFormat="yy/mm/dd" />
                                    <label>Fecha</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </Card>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <Card>
                        {rendertabla()}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReporteOrdenDeProd;