import React, { useContext, useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FloatLabel } from 'primereact/floatlabel';
import '../styles/Entrada.css';
import ProductModal from '../components/alistamiento/ProductModal';
import { userData } from '../context/UserContext';
import Swal from 'sweetalert2';
import { withSwalLoading, swalMensaje, swalMissing } from '../utils/SwalUtils'
import { fetchTiposPreparacion } from '../services/maestrosService';
import { postEntrada, fetchEntradas, cancelarEntrada } from '../services/alistamientoService';


const Entrada = () => {

    // Campos a llenar en el formulario
    const formAlistamiento = {
        tipoPrep: '',
        producto: '',
        codigoProducto: '',
        lote: '',
        registroINVIMA: '',
        fechaVencimiento: null,
        cantidad: '',
    }

    //Hooks
    const { user } = userData();

    const maxId = 0;
    const [nextId, setNextId] = useState(maxId + 1);
    const [form, setForm] = useState(formAlistamiento);
    const [vista, setVista] = useState('nuevo'); // 'nuevo' | 'consulta'
    const [elementos, setElementos] = useState([]);
    const [tipoPrepBloqueado, setTipoPrepBloqueado] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [tiposPrep, setTiposPrep] = useState([]);
    const [seleccionConsulta, setSeleccionConsulta] = useState([]);
    const [consultaRows, setConsultaRows] = useState([]);
    const [emptyMess, setEmptyMess] = useState('Sin informaci\u00F3n');


    //Refs
    const tipoPrepRef = useRef(null);
    const productoRef = useRef(null);
    const loteRef = useRef(null);
    const fechaVencRef = useRef(null);
    const regInvimaRef = useRef(null);
    const cantidadRef = useRef(null);
    const dataTableRef = useRef(null);

    //Validación de campos
    const camposObligatorios = [
        { key: 'tipoPrep', label: 'Tipo de preparaci\u00F3n', ref: tipoPrepRef },
        { key: 'producto', label: 'Producto', ref: productoRef },
        { key: 'lote', label: 'Lote', ref: loteRef },
        { key: 'fechaVencimiento', label: 'Fecha de vencimiento', ref: fechaVencRef },
        { key: 'cantidad', label: 'Cantidad', ref: cantidadRef },
        { key: 'registroINVIMA', label: 'Registro Invima', ref: regInvimaRef },
    ];

    const lastTipoKey = React.useMemo(
        () => user ? `lastTipoPrep:${user.empresa}:${user.sede}:${user.usuario}` : null,
        [user]
    );

    //Cargar los datos iniciales
    useEffect(() => {
        const loadDatos = async () => {
            withSwalLoading('Cargando informaci\u00F3n')
            if (user?.empresa == null) {
                swalMensaje('warning', "No se encontr\u00F3 campo Empresa en url")
                return
            }
            if (user?.sede == null) {
                swalMensaje('warning', "No se encontr\u00F3 campo Sede en url")
                return
            }
            try {
                const tipos = await fetchTiposPreparacion();
                setTiposPrep(tipos);
                if (lastTipoKey) {
                    const saved = sessionStorage.getItem(lastTipoKey);
                    if (saved) setForm(f => ({ ...f, tipoPrep: saved }));
                }
                Swal.close()
            } catch (err) {
                swalMensaje('warning', err.message)
            }
        };
        loadDatos();
    }, [user]);


    // Handlers
    const handleNew = () => {
        setVista('nuevo');
        setTipoPrepBloqueado(false);
    };
    const handleClear = () => {
        setForm(formAlistamiento);
        setElementos([]);
        setTipoPrepBloqueado(false);
        if (lastTipoKey) sessionStorage.removeItem(lastTipoKey);
    };
    const handleAdd = () => {
        if (!form.tipoPrep) {
            swalMensaje('warning', 'Seleccione el Tipo de Preparación');
            return;
        }
        // Validación de campos obligatorios
        const faltantes = camposObligatorios
            .filter(c => !form[c.key] || String(form[c.key]).trim() === '');

        const labels = faltantes.map(c => c.label).join(', ');
        const primer = faltantes[0];

        if (faltantes.length > 0) {
            swalMissing(labels, primer)
            return;
        }

        // 1) Construimos el objeto con los datos actuales + un id
        const nuevoRegistro = {
            ...form,
            id: nextId
        };

        // 2) Lo añadimos al array 
        setElementos(prev => {
            const updated = [...prev, nuevoRegistro];
            // Bloquear el dropdown si es el primer agregado
            if (updated.length === 1) setTipoPrepBloqueado(true);
            return updated;
        });

        // 3) Preparamos el siguiente id y reseteamos el formulario
        setNextId(prev => prev + 1);
        setForm(f => ({
            ...formAlistamiento,
            tipoPrep: f.tipoPrep // mantiene el tipo seleccionado visible
        }));


    };
    const handleSave = () => {
        try {
            if (!elementos || elementos.length === 0) {
                swalMensaje('warning', 'No hay entradas para guardar');
                return;
            }
            withSwalLoading('Guardando...');
            const resp = postEntrada(elementos, user);
            swalMensaje('success', 'Entradas enviadas');
        } catch (err) {
            swalMensaje('error', err.message || 'No se pudo guardar');
        }
    };
    const handleSearch = async () => {
        if (!form.tipoPrep) {
            const primer = camposObligatorios.filter(c => c.key == 'tipoPrep');
            swalMissing("Tipo de preparaci\u00F3n", primer[0])
            return;
        }
        withSwalLoading('Cargando información');
        try {
            const rows = await fetchEntradas(form.tipoPrep);
            if (rows === 0) {
                setEmptyMess('No se encontraron insumos')
                swalMensaje('info', 'No se encontraron insumos ingresados en el d\u00EDa de hoy');
                setVista('consulta');
            } else {
                setConsultaRows(rows.sort((a, b) => (a.Csc ?? 0) - (b.Csc ?? 0)));
                console.log("data de busqueda", rows)
                setConsultaRows(rows);
                setVista('consulta');
                setTipoPrepBloqueado(true);
                setSeleccionConsulta([]);
                Swal.close();
            }
        } catch (err) {
            swalMensaje('error', 'Error cargando datos: ' + err.message);
        }
    };

    const handleAfterSelect = () => {
        setTimeout(() => {
            if (cantidadRef.current) cantidadRef.current.focus();
        }, 100); // Delay para esperar que el modal se cierre
    };

    const handleCancelarSeleccion = async () => {
        console.log("data a cancelar", seleccionConsulta, form.tipoPrep, user)
        try {
            if (!seleccionConsulta || seleccionConsulta.length === 0) {
                swalMensaje('warning', 'No hay entradas para cancelar');
                return;
            }
            await cancelarEntrada(seleccionConsulta, form.tipoPrep, user)
            handleSearch();
        } catch (err) {
            swalMensaje('error', err.message || 'No se pudo cancelar');
        }
    }

    // Maneja la eliminación de filas
    const handleDeleteRow = (rowData) => {
        setElementos(prev => prev.filter(item => item.id !== rowData.id));
    };

    // Maneja la edición de filas
    const onRowEditComplete = (e) => {
        const updatedRow = e.newData;
        setElementos(prev => prev.map(item => item.id === updatedRow.id ? updatedRow : item));
    };
    // Maneja la edición de filas numericas
    const numberEditor = (options) => (
        <InputNumber
            value={options.value}
            onValueChange={e => options.editorCallback(e.value)}
            min={0}
            showButtons
        />
    );

    const onProductSelect = (product) => {
        setForm(f => ({
            ...f,
            producto: product.Nombre,
            codigoProducto: product.Codigo,
            lote: product.lote,
            registroINVIMA: product.RegInvima,
            fechaVencimiento: product.fechaVencimiento
        }));
    };

    //Renderiza la tabla de elementos según el tipo de entrada
    const renderTabla = () => {
        return (
            <div className="tabla-container">
                <DataTable
                    value={elementos}
                    ref={dataTableRef}
                    editMode="row"
                    dataKey="id"
                    scrollable scrollHeight="350px"
                    tableStyle={{
                        minWidth: '800px',
                        tableLayout: 'fixed'
                    }}
                    onRowEditComplete={onRowEditComplete}
                    removableSort
                    showGridlines
                >
                    <Column
                        headerClassName="no-border-right btn-col"
                        bodyClassName="no-border-right btn-col"
                        body={row => (
                            <Button
                                icon="pi pi-times"
                                rounded
                                className="p-button-rounded btn-delete"
                                size="small"
                                aria-label="Eliminar"
                                onClick={() => handleDeleteRow(row)}
                            />
                        )}
                        style={{ width: '30px', textAlign: 'center' }}
                    />
                    <Column rowEditor headerClassName="no-border-left btn-col"
                        bodyClassName="no-border-left btn-col"
                        style={{ width: '110px', textAlign: 'center' }}
                    />
                    <Column field="id" header="ID" style={{
                        width: '60px'
                    }} />
                    <Column field="producto" header="Producto" sortable style={{
                        width: '550px'
                    }} />
                    <Column field="cantidad" header="Cantidad" sortable
                        editor={numberEditor}
                        style={{
                            width: '200px',
                        }} />
                    <Column field="lote" header="Lote" style={{
                        width: '120px'
                    }} />
                    <Column field="registroINVIMA" header="Registro INVIMA" style={{
                        width: '180px'
                    }} />
                    <Column
                        field="fechaVencimiento"
                        header="Vencimiento"
                        body={r => r.fechaVencimiento?.toLocaleDateString() || ''}
                        style={{
                            width: '140px'
                        }}
                    />
                </DataTable>
            </div>
        );
    };
    const renderTablaConsulta = () => {
        const data = consultaRows
        return (
            < div className="tabla-container" >
                <DataTable
                    value={data}
                    scrollable
                    scrollHeight="350px"
                    removableSort
                    showGridlines
                    tableStyle={{ tableLayout: 'fixed' }}
                    selection={seleccionConsulta}
                    onSelectionChange={(e) => setSeleccionConsulta(e.value)}
                    emptyMessage={emptyMess}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="Csc" header="Item" style={{ width: '65px' }} />
                    <Column field="Id" header="#" style={{ width: '40px' }} />
                    <Column field="Nombre"
                        header="Medicamento"
                        style={{ width: '560px' }} />
                    <Column field="Lote" header="Lote" style={{ width: '120px' }} />
                    <Column field="CantSol" header="Catidad" style={{ width: '120px' }} />
                    <Column field="FechVenc" header="Vencimiento" style={{ width: '160px' }} />
                    <Column field="RegInvima" header="Registro INVIMA" style={{ width: '180px' }} />
                </DataTable>
                {/*Boton cancelar */}
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        label={`Cancelar (${seleccionConsulta.length})`}
                        className="btn-cerrar"
                        onClick={handleCancelarSeleccion}
                        disabled={seleccionConsulta.length === 0}
                    />
                </div>
            </div>
        )
    };

    return (
        <div className="page">
            <ProductModal
                visible={showProductModal}
                onHide={() => setShowProductModal(false)}
                onSelect={onProductSelect}
                onAfterSelect={handleAfterSelect}
                optionLabel="label"
                optionValue="value"
            />

            {/* Botonera */}
            <div className="btn-group flex-wrap">
                <Button label="Nuevo" icon="pi pi-plus" className="btn-lg btn-success" onClick={handleNew} />
                <Button label="Consulta" icon="pi pi-search" className=" btn-success" onClick={handleSearch} />
                <Button label="Limpiar" icon="pi pi-trash" className=" btn-success" onClick={handleClear} />
                <Button label="Agregar" icon="pi pi-file-plus" className=" btn-success" onClick={handleAdd} />
                <Button label="Guardar" icon="pi pi-save" className=" btn-success" onClick={handleSave} />
            </div>

            <div className="content">
                <div style={{ marginBottom: '1rem ' }}>
                    <div className="filter-container">
                        <Card>
                            <div className=" p-fluid form-grid-entrada">
                                <div className="p-field div1 ">
                                    <FloatLabel>
                                        <Dropdown
                                            ref={tipoPrepRef}
                                            className="custom-dropdown"
                                            options={tiposPrep}
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Seleccione..."
                                            value={form.tipoPrep}
                                            onChange={e => {
                                                setForm({ ...form, tipoPrep: e.value });
                                                if (lastTipoKey) sessionStorage.setItem(lastTipoKey, e.value);
                                                setTimeout(() => productoRef.current?.focus(), 100);
                                            }}
                                            disabled={tipoPrepBloqueado}
                                        />
                                        <label>Tipo de Preparaci&oacute;n </label>
                                    </FloatLabel>
                                </div>
                                {/*Producto*/}
                                <div className="p-field p-inputgroup div2" >
                                    <InputText
                                        ref={productoRef}
                                        id="prod"
                                        value={form.producto}
                                        readOnly
                                        placeholder="Buscar nombre del producto"
                                        onClick={() => setShowProductModal(true)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();  // opcional, evita comportamientos extraños
                                                setShowProductModal(true);
                                            }
                                        }}
                                        style={{ cursor: 'pointer', background: '#f7f7f7' }}
                                        tooltipOptions={{ position: 'bottom' }}
                                        tooltip={form.producto}
                                        disabled={vista === 'consulta'}
                                    />
                                    <Button icon="pi pi-search" className="p-button btn-success"
                                        onClick={() => setShowProductModal(true)}
                                        disabled={vista === 'consulta'}
                                    />
                                </div>
                                {/*Lote*/}
                                <div className="p-field div3">
                                    <FloatLabel>
                                        <InputText
                                            id="lote"
                                            ref={loteRef}
                                            value={form.lote}
                                            onChange={e => setForm(f => ({ ...f, lote: e.target.value }))}
                                            disabled={vista === 'consulta'}
                                        />
                                        <label htmlFor="lote">Lote</label>
                                    </FloatLabel>
                                </div>
                                {/*Fecha de Vencimiento*/}
                                <div className="p-field div4" >
                                    <FloatLabel>
                                        <Calendar
                                            ref={fechaVencRef}
                                            id="fv"
                                            value={form.fechaVencimiento}
                                            onChange={e => setForm(f => ({ ...f, fechaVencimiento: e.value }))}
                                            placeholder="fecha de vencimiento"
                                            dateFormat="yy/mm/dd"
                                            showIcon
                                            disabled={vista === 'consulta'}
                                        />
                                        <label htmlFor="fv">Fecha de vencimiento</label>
                                    </FloatLabel>
                                </div>
                                {/*Registro Invima*/}
                                <div className="p-field div5" >
                                    <FloatLabel>
                                        <InputText
                                            id="reg"
                                            ref={regInvimaRef}
                                            value={form.registroINVIMA}
                                            onChange={e => setForm(f => ({ ...f, registroINVIMA: e.target.value }))}
                                            disabled={vista === 'consulta'}
                                        />
                                        <label htmlFor="reg">Registro INVIMA</label>
                                    </FloatLabel>
                                </div>
                                {/*Cantidad*/}
                                <div className="p-field div6" >
                                    <FloatLabel>
                                        <InputNumber
                                            ref={cantidadRef}
                                            id="cant"
                                            value={form.cantidad || null}
                                            onChange={e => setForm(f => ({ ...f, cantidad: e.value }))}
                                            placeholder=" "
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();  // opcional, evita comportamientos extraños
                                                    handleAdd();
                                                }
                                            }}
                                            disabled={vista === 'consulta'}
                                        />
                                        <label htmlFor="cant">Cantidad</label>
                                    </FloatLabel>
                                </div>

                            </div>
                        </Card>
                    </div>

                </div>
                {/*Tabla*/}
                {vista === 'nuevo' ? renderTabla() : renderTablaConsulta()}
            </div>
        </div>
    );
};

export default Entrada;