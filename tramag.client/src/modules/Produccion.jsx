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
import { fetchOrdenesProduccion, fetchDatosEtiquetas } from '../services/produccionService';
import ProduccionModal from '../components/produccion/ProduccionModal';
import ImpresionModal from '../components/produccion/ImpresionModal';
import { withSwalLoading, swalMensaje, swalMissing } from '../utils/SwalUtils';
import { openPdf } from '../utils/printPdf';
import { userData } from '../context/UserContext';
import '../styles/Produccion.css';

const Produccion = () => {

    //Hooks
    const { user } = userData();

    // VARIABLES VACIAS PARA ESTADO INICIAL
    const formProduccion = {
        servicio: '',
        empresa: '',
        sede: '',
        ordenar: '',
        habitacion: '',
        ordenProduccion: '',
    }

    // HOOKS
    const [ordenes, setOrdenes] = useState([]);
    const [form, setForm] = useState(formProduccion);
    const [modalVisible, setModalVisible] = useState(false);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [servicios, setServicios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [colores, setColores] = useState([]);
    const [qf, setQf] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [imprimirVisible, setImprimirVisible] = useState(false);
    const [seleccionImpresion, setSeleccionImpresion] = useState([]);
    const [emptyMess, setEmptyMess] = useState('Sin informaci\u00F3n');

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


    //Handlers
    //CONSULTA
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
            const data = await fetchOrdenesProduccion(form.empresa, form.sede, form.servicio);
            setOrdenes(data);
            setSeleccionImpresion([]);
            Swal.close();
        } catch (err) {
            swalMensaje('error', 'Error cargando datos: ' + err.message);
        }
    };
    //LIMPIAR
    const handleClear = () => {
        setOrdenes([]);
        setSeleccionImpresion([]);
        setForm(f => ({
            ...f,
            servicio: ''
        }));
        setGlobalFilter('');
        setTimeout(() => servicioRef.current?.focus(), 100);
    }
    //IMPRIMIR
    const handlePrint = () => {
        setImprimirVisible(true);
    }

    const handleCellSelect = async (e) => {
        const row = e.data;
        if (!row) return;

        if (row.EstCod == '1') {
            setFilaSeleccionada({ ...row, etiquetaData: null });
            setModalVisible(true);
        }
        else {
            let etiData = null;
            try {
                etiData = await fetchDatosEtiquetas(row.Empresa, row.Sede, row.Csc);
            } catch (err) {
                console.log('Error cargando datos de etiqueta', err)
            }
            setFilaSeleccionada({ ...row, etiquetaData: etiData[0] });
            setModalVisible(true);
        }
    };

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
                    const serviciosMapped = await fetchServicios(form.empresa, form.sede);
                    setServicios(serviciosMapped);
                    Swal.close(setTimeout(() => servicioRef.current?.focus(), 100))
                }

                // colores
                const colores = await fetchColores();
                setColores(colores);
               
                //qf
                const qfs = await fetchQFs();
                setQf(qfs)
                Swal.close()

            } catch (err) {
                swalMensaje('warning', err.message)
            }
        };

        loadAll();
    }, [form.empresa, form.sede]);

    const dataPrint = { colores, qf, user, seleccionImpresion }
    //TABLA
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
                selection={seleccionImpresion}
                onSelectionChange={(e) => {
                    const soloProduccion = (e.value || []).filter(r => r?.EstCod === '2');
                    setSeleccionImpresion(soloProduccion);
                }}
                isDataSelectable={(event) => event?.data?.EstCod === '2'}
                rowClassName={(row) => ({
                    'fila-produccion': row.EstCod === "2",
                    'row-nocheck': row.EstCod !== "2"
                })}
                emptyMessage={emptyMess}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
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
                            onClick={() => handleCellSelect({ data: row })} />
                    )}
                    style={{ width: '60px', textAlign: 'center' }}
                />
                <Column field="EstCod" header="EstCod" sortable style={{ display: 'none' }} />
                <Column field="NomEstado" header="Estado" style={{ width: '100px' }} />
                <Column field="Habitacion" header="Hab" sortable style={{ width: '90px' }} />
                <Column field="TipdeDoc" header="Tipo" style={{ width: '60px' }} />
                <Column field="Documento" header="Documento" sortable style={{ width: '150px' }} />
                <Column field="NombreCompleto" header="Nombre" sortable style={{ width: '320px' }} />
                <Column field="NombreMedicamento" header="Medicamento" sortable style={{ width: '650px' }} />
                <Column field="DosisPrescrita" header="Dosis Prescrita" sortable style={{ width: '180px' }} />
                <Column field="Frecuencia" header="Frecuencia" style={{ width: '130px' }} />
                <Column field="Dosis24H" header="Dosis24H" style={{ width: '130px' }} />
                <Column field="DosisMinPresentacion" header="Dosis Min Pres" style={{ width: '180px' }} />
                <Column field="Dosisminsol" header="Dosisminsol" style={{ width: '150px' }} />
                <Column field="DosisTotal24H" header="Dosis Total 24H" style={{ width: '180px' }} />
                <Column field="Edad" header="Edad" style={{ width: '90px' }} />
                <Column field="FechaHora" header="Fecha" style={{ width: '180px' }} />
                <Column field="Ingreso" header="Ingreso" style={{ width: '100px' }} />
                <Column field="Folio" header="No Orden" style={{ width: '120px' }} />
            </DataTable>
        </div>
    );


    //RETURN
    return (
        <>
            <div className="page">
                <div className="panel">
                    <h2>Producción</h2>
                    <div className="btn-group flex-wrap">
                        <Button label="Consulta" icon="pi pi-search" className="btn-lg btn-success" onClick={handleSearch} />
                        <Button label="Limpiar" icon="pi pi-trash" className="btn-lg btn-success" onClick={handleClear} />
                        <Button label="Agregar" icon="pi pi-file-plus" className="btn-lg btn-success" disabled />
                        <Button label="Guardar" icon="pi pi-save" className="btn-lg btn-success" disabled />
                        <Button label="Imprimir " icon="pi pi-print" className="btn-lg btn-success" disabled={seleccionImpresion.length === 0} onClick={handlePrint} />
                    </div>

                    <div className="content">
                        <ProduccionModal
                            visible={modalVisible}
                            onHide={() => setModalVisible(false)}
                            data={filaSeleccionada}
                            user={user}
                            onSave={(nuevaFila) => {
                                setOrdenes(prev => prev.map(f => f.Folio === nuevaFila.Folio ? nuevaFila : f));
                                handleSearch();
                            }}
                        />

                        <ImpresionModal
                            visible={imprimirVisible}
                            data={dataPrint}
                            onHide={() => setImprimirVisible(false)}
                            onImprimir={async ({ ok, lista, error }) => {
                                try {
                                    if (!ok) throw error;                     
                                    if (!lista || lista.length === 0) {
                                        throw new Error('No hay etiquetas para el color seleccionado. Verifique el color.');
                                    }
                                    const printWindow = window.open('', '_blank');
                                    await openPdf('/Produccion/GetPdfEti', lista, printWindow);
                                } catch (e) {
                                    console.log("error del modal",e)
                                    swalMensaje('warning', e.message);        
                                } finally {
                                    setImprimirVisible(false);
                                }
                            }}
                        />

                        <div style={{ marginBottom: '1rem ' }}>
                            <div className="filter-container">
                                <Card>
                                    <div className="p-fluid form-grid-produccion">
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
        </>
    );
};

export default Produccion;