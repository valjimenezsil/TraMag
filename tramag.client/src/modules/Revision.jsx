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
import { fetchServicios, fetchEmpresas, fetchSedes } from '../services/maestrosService';
import { fetchOrdenesRev } from '../services/revisionService'
import { withSwalLoading, swalMensaje, swalMissing } from '../utils/SwalUtils';
import { userData } from '../context/UserContext';
import RevisionModal from '../components/revision/RevisionModal'
import '../styles/Revision.css';

const Revision = () => {

    //Hooks
    const { user } = userData();

    // VARIABLES VACIAS PARA ESTADO INICIAL
    const formRevision = {
        servicio: '',
        empresa: '',
        sede: '',
    }

    // HOOKS
    const [ordenes, setOrdenes] = useState([]);
    const [form, setForm] = useState(formRevision);
    const [servicios, setServicios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [emptyMess, setEmptyMess] = useState('Sin informaci\u00F3n');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOrden, setSelectedOrden] = useState(null);


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
            const data = await fetchOrdenesRev(form.empresa, form.sede, form.servicio);
            setOrdenes(data);
            Swal.close();
        } catch (err) {
            swalMensaje('error', 'Error cargando datos: ' + err.message);
        }
    };

    const handleClear = async () => { }

    const handlePrint = async () => { }

    const handleCellSelect = async (row) => {
        console.log(row)
        setModalVisible(true);
        setSelectedOrden(row);
    }

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        if (!user) return;
        setForm(f => ({
            ...f,
            empresa: user.empresa,
            sede: user.sede

        }));
    }, [user]);

    //Cargar datos iniciales al montar el componente
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
                    const serviciosMapped = await fetchServicios(form.empresa, form.sede);
                    setServicios(serviciosMapped);
                    Swal.close(setTimeout(() => servicioRef.current?.focus(), 100))
                }

            } catch (err) {
                swalMensaje('warning', err.message)
            }
        };

        loadAll();
    }, [form.empresa, form.sede]);


    //Buscador de la tabla
    const renderHeader = () => (
        <div className="table-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '0.5rem ' }}>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                    type="search"
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Buscar en tabla..."
                />
            </IconField>
        </div>
    );
    //Tabla
    const rendertabla = () => (
        <div className="tabla-container">
            <DataTable
                value={ordenes}
                globalFilter={globalFilter}
                globalFilterFields={[
                    'NomEstado', 'Habitacion', 'TipdeDoc',
                    'Documento', 'NombreCompleto', 'NombreMedicamento',
                    'Frecuencia', 'Dosis24H', 'DosisMinPresentacion',
                    'Dosisminsol', 'Edad', 'Ingreso', 'Folio'
                ]}
                sortField="EstCod"
                sortOrder={-1}
                scrollable
                scrollHeight="340px"
                removableSort
                showGridlines
                tableStyle={{ tableLayout: 'fixed' }}
                emptyMessage={emptyMess}
            >

                <Column
                    headerClassName="no-border-right btn-col"
                    bodyClassName="no-border-right btn-col"
                    body={row => (
                        <Button
                            icon="pi pi-pencil"
                            rounded
                            className="p-button-rounded btn-edit"
                            size="small"
                            aria-label="Eliminar"
                            onClick={() => handleCellSelect(row)} />
                    )}
                    style={{ width: '60px', textAlign: 'center' }}
                />
                <Column field="EstCod" header="EstCod" sortable style={{ display: 'none' }} />
                <Column field="ProEstNom" header="Estado" style={{ width: '100px' }} />
                <Column field="Hab" header="Hab" sortable style={{ width: '90px' }} />
                <Column field="TipoIde" header="Tipo" style={{ width: '60px' }} />
                <Column field="Ide" header="Documento" sortable style={{ width: '150px' }} />
                <Column field="NombreCompleto" header="Nombre" sortable style={{ width: '320px' }} />
                <Column field="NombreMedicamento" header="Medicamento" sortable style={{ width: '650px' }} />
                <Column field="DosPre" header="Dosis Prescrita" sortable style={{ width: '180px' }} />
                <Column field="Frecuencia" header="Frecuencia" style={{ width: '130px' }} />
                <Column field="Dosis24H" header="Dosis24H" style={{ width: '130px' }} />
                <Column field="MSDos" header="Dosis Min Pres" style={{ width: '180px' }} />
                <Column field="Dosisminsol" header="Dosisminsol" style={{ width: '150px' }} />
                <Column field="DosisTotal24H" header="Dosis Total 24H" style={{ width: '180px' }} />
                <Column field="Edad" header="Edad" style={{ width: '90px' }} />
                <Column field="Ingreso" header="Ingreso" style={{ width: '100px' }} />
                <Column field="Folio" header="No Orden" style={{ width: '120px' }} />
            </DataTable>
        </div>
    );

    return (
        <div className="page">
            <div className="panel">
                <h2>Revisi&oacute;n</h2>
                <div className="btn-group flex-wrap">
                    <Button label="Consulta" icon="pi pi-search" className="btn-lg btn-success" onClick={handleSearch} />
                    <Button label="Limpiar" icon="pi pi-trash" className="btn-lg btn-success" onClick={handleClear} />
                    <Button label="Agregar" icon="pi pi-file-plus" className="btn-lg btn-success" disabled />
                    <Button label="Guardar" icon="pi pi-save" className="btn-lg btn-success" disabled />
                    <Button label="Imprimir " icon="pi pi-print" className="btn-lg btn-success" onClick={handlePrint} />
                </div>
                <div className="content">
                    <RevisionModal
                        visible={modalVisible}
                        onHide={() => setModalVisible(false)}
                        empresa={form.empresa}
                        sede={form.sede}
                        servicio={form.servicio}
                        orden={ selectedOrden }
                    />
                    <div style={{ marginBottom: '1rem ' }}>
                        <div className="filter-container">
                            <Card>
                                <div className="p-fluid form-grid-produccion">
                                    {/*Empresa*/}
                                    <div className="p-field proddiv1">
                                        <FloatLabel>
                                            <Dropdown
                                                id="empresa"
                                                optionLabel="label"
                                                optionValue="value"
                                                options={empresas}
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
                                    {/*Sede*/}
                                    <div className="p-field proddiv2">
                                        <FloatLabel>
                                            <Dropdown
                                                id="sede"
                                                ref={sedeRef}
                                                options={sedes}
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Seleccione "
                                                value={form.sede}
                                                appendTo="self"
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
                                    <div className="p-field proddiv3">
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
                                                onChange={e => setForm(f => ({ ...f, servicio: e.value }))}
                                                filter
                                                appendTo="self"
                                                disabled={!form.sede || form.sede === ''}
                                            />
                                            <label>Servicio</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
                        {renderHeader()}
                        {rendertabla()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Revision;