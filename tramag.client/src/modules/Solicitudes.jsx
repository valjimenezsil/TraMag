import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import Swal from 'sweetalert2';
import { userData } from '../context/UserContext';
import { fetchMezclaData } from '../services/maestrosService';
import { postSolicitud, fetchServiciosExt, fetchOrdenesExternas, cancelSolicitudesExt } from '../services/solicitudesService';
import { withSwalLoading, swalMensaje, swalMissing } from '../utils/SwalUtils'
import '../styles/Solicitudes.css';


const Solicitudes = () => {

    // ESTADO VACIO--FORMULARIO SIN LLENAR
    const formSolicitudes = {
        servicio: '',
        nomServicio: '',
        medicamento: '',
        cantidad: null,
        dosis: null,
        observacion: '',
    }

    //Refs
    const servicioRef = useRef(null);
    const medicamentoRef = useRef(null);
    const cantidadRef = useRef(null);
    const dosisRef = useRef(null);
    const observacionRef = useRef(null);

    //CAMPOS OBLIGATORIOS
    const camposObligatorios = [
        { key: 'servicio', label: 'Servicio', ref: servicioRef },
        { key: 'medicamento', label: 'Medicamento', ref: medicamentoRef },
        { key: 'cantidad', label: 'Cantidad', ref: cantidadRef },
        { key: 'dosis', label: 'Dosis', ref: dosisRef }
    ]

    //Hooks
    const { user } = userData();

    //Hooks
    const [form, setForm] = useState(formSolicitudes);
    const [mezclas, setMezclas] = useState([]);
    const [mezclasRaw, setMezclasRaw] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const maxId = 0;
    const [nextId, setNextId] = useState(maxId + 1);
    const [servicios, setServicios] = useState([]);
    const [lastServicio, setLastServicio] = useState(null);
    const [servicioBloqueado, setServicioBloqueado] = useState(false);
    const [vista, setVista] = useState('nuevo'); // 'nuevo' | 'consulta'
    const [consultaRows, setConsultaRows] = useState([]);
    const [seleccionConsulta, setSeleccionConsulta] = useState([]);
    const [emptyMess, setEmptyMess] = useState('Sin informaci\u00F3n');


    // Servicio prev
    const lastService = React.useMemo(
        () => user ? `lastServicio:${user.empresa}:${user.sede}:${user.usuario}` : null,
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
                const [servResp, mezResp] = await Promise.all([
                    fetchServiciosExt(user.empresa, user.sede),
                    fetchMezclaData()
                ]);
                setServicios(servResp);

                if (lastService) {
                    const saved = sessionStorage.getItem(lastService);
                    if (saved) {
                        const sel = servResp.find(s => String(s.value) === String(saved));
                        if (sel) {
                            setLastServicio(sel.value);
                            setForm(f => ({ ...f, servicio: sel.value, nomServicio: sel.label }));
                        }
                    }
                }

                setMezclas(mezResp.dropdown);
                setMezclasRaw(mezResp.raw)
                Swal.close()
            } catch (err) {
                swalMensaje('warning', err.message)
            } finally {

            }
        };
        loadDatos();
    }, [user]);

    //Informacion de la mezcla seleccionada
    const mezclaSeleccionada = React.useMemo(() => {
        if (!form.medicamento) return null;
        const [MSCodi, MSPrAc, CncCd, MSForm] = String(form.medicamento).split('-');
        return mezclasRaw.find(m =>
            String(m.MSCodi) === MSCodi &&
            String(m.MSPrAc) === MSPrAc &&
            String(m.CncCd) === CncCd &&
            String(m.MSForm) === MSForm
        ) || null;
    }, [form.medicamento, mezclasRaw]);

    //Buscar unidad de dosis
    const unidadDosis = mezclaSeleccionada?.MSUni || '';

    //Funciones de botones
    //NUEVO
    const handleNew = () => {
        setForm(formSolicitudes);
        setEmptyMess('Sin informaci\u00F3n');
        setNextId(1);
        setSolicitudes([]);
        setConsultaRows([]);
        setVista('nuevo');
        setServicioBloqueado(false);
        if (lastService) sessionStorage.removeItem(lastService);
        setLastServicio(null);
    };
    //CONSULTA
    const handleSearch = async () => {
        if (!form.servicio) {
            const primer = camposObligatorios.filter(c => c.key == 'servicio');
            swalMissing("servicio", primer[0])
            return;
        }
        withSwalLoading('Cargando información');
        try {
            const data = await fetchOrdenesExternas(user.empresa, user.sede, form.servicio);

            const list = Array.isArray(data?.response) ? data.response
                : Array.isArray(data) ? data
                    : [];
            const nomServ = form.nomServicio || (servicios.find(s => String(s.value) === String(form.servicio))?.label ?? '');

            const rows = list.map((it) => ({
                Id: it.Id,
                Csc: it.CscSol,
                cancelable: it.EstCod == "1",
                Empresa: user.empresa,
                Sede: user.sede,
                UsuAdd: user.usuario,
                Servicio: form.servicio,
                nomServicio: nomServ,

                // normaliza nombres
                MSCodi: it.MSCodi,
                MSPrAc: it.MSPrAc,
                CncCd: it.CncCd,
                MSForm: it.MSForm,

                DosisPrescrita: `${Number(it.DosisPrescrita)} ${String(it.Unidad)}`,
                DosisMinPresentacion: Number(it.DosisMinPresentacion),
                Cantidad: it.Cantidad,
                Observacion: it.Observacion,

                // para que la columna “Medicamento” pinte la etiqueta con tu dropdown
                medicamento: `${it.MSCodi ?? it.msCodi ?? ''}-${it.MSPrAc ?? it.msPrAc ?? ''}-${it.CncCd ?? it.cncCd ?? ''}-${it.MSForm ?? it.msForm ?? ''}`
            }));
            setConsultaRows(rows.sort((a, b) => (a.csc ?? 0) - (b.csc ?? 0)));
            setVista('consulta');
            setServicioBloqueado(false);
            setSeleccionConsulta([])
            Swal.close();

            if (rows.length === 0) {
                setEmptyMess('No se encontraron \u00F3rdenes')
                swalMensaje('info', 'Este servicio no tiene solicitudes registradas.');
            }
        } catch (err) {
            swalMensaje('error', 'Error cargando datos: ' + err.message);
        }
    };
    //LIMPIAR
    const handleClear = () => {
        setForm(formSolicitudes);
        if (lastService) sessionStorage.removeItem(lastService);
        setLastServicio(null);
        setServicioBloqueado(false);
        setSolicitudes([]);
    };
    //GUARDAR
    const handleSave = async () => {
        try {
            if (!solicitudes || solicitudes.length === 0) {
                swalMensaje('warning', 'No hay solicitudes para guardar');
                return;
            }
            withSwalLoading('Guardando...');
            const resp = await postSolicitud(solicitudes);
            swalMensaje('success', resp.message);

            setSolicitudes([]);
            setServicioBloqueado(false);
            setForm(formSolicitudes);
            if (lastService) sessionStorage.removeItem(lastService);
            setLastServicio(null);
            setNextId(1);

        } catch (err) {
            swalMensaje('error', err.message || 'No se pudo guardar');
        }
    };
    //AGREGAR  
    const handleAdd = async () => {
        const faltantes = camposObligatorios
            .filter(c => !form[c.key] || String(form[c.key]).trim() === '');

        const labels = faltantes.map(c => c.label).join(', ');
        const primer = faltantes[0];

        if (faltantes.length > 0) {
            swalMissing(labels, primer)
            return;
        }
        const nueva = {
            id: nextId,
            empresa: user.empresa,
            sede: user.sede,
            usuAdd: user.usuario,
            servicio: form.servicio,
            nomServicio: form.nomServicio,
            MSCodi: mezclaSeleccionada.MSCodi,
            MSPrAc: mezclaSeleccionada.MSPrAc,
            CncCd: mezclaSeleccionada.CncCd,
            MSForm: mezclaSeleccionada.MSForm,
            dosisPrescrita: form.dosis,
            MSUni: mezclaSeleccionada.MSUni,
            DosisMinPresentacion: mezclaSeleccionada.DosisMinPresentacion,
            cantidad: form.cantidad,
            observacion: form.observacion,
            medicamento: form.medicamento
        };

        setSolicitudes(prev => {
            const updated = [...prev, nueva];
            if (updated.length === 1) {
                setServicioBloqueado(true);
            }
            return updated;
        });

        setNextId(prev => prev + 1);

        setForm(prev => ({
            ...formSolicitudes,
            servicio: prev.servicio,
            nomServicio: prev.nomServicio
        }));
        setTimeout(() => medicamentoRef.current?.focus(), 100);
    };
    //CANCELAR SOLICITUDES
    const handleCancelarSeleccion = async () => {
        try {
            if (!seleccionConsulta || seleccionConsulta.length === 0) {
                swalMensaje('warning', 'No hay solicitudes para cancelar');
                return;
            }
            await cancelSolicitudesExt(seleccionConsulta, user)
            handleSearch();
        } catch (err) {
            swalMensaje('error', err.message || 'No se pudo cancelar');
        }

    }

    // Funciones tabla
    const numberEditor = options => (
        <InputNumber
            value={options.value}
            onValueChange={e => options.editorCallback(e.value)}
            mode="decimal"
            showButtons
            min={0}
            style={{ minWidth: '100px' }}
        />
    );
    const onRowEditInit = () => { };
    const onRowEditCancel = () => { };
    const onRowEditComplete = e => {
        const updated = e.newData;
        setSolicitudes(prev =>
            prev.map(s => s.id === updated.id ? updated : s)
        );
    };
    const handleDeleteRow = (rowData) => {
        setSolicitudes(prev =>
            prev.filter(solicitud => solicitud.id !== rowData.id)
        );
    };

    //TABLAS
    const rendertabla = () => {
        const data = solicitudes;
        return (
            <div className="tabla-container">
                <DataTable
                    value={data}
                    editMode="row"
                    dataKey="id"
                    scrollable
                    scrollHeight="350px"
                    removableSort
                    showGridlines
                    onRowEditInit={onRowEditInit}
                    onRowEditCancel={onRowEditCancel}
                    onRowEditComplete={onRowEditComplete}
                    tableStyle={{ tableLayout: 'fixed' }}
                    emptyMessage={emptyMess}

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
                    <Column
                        rowEditor
                        headerClassName="no-border-left btn-col"
                        bodyClassName="no-border-left btn-col"
                        style={{ width: '110px', textAlign: 'center' }}
                    />
                    <Column
                        field="id"
                        header="#"
                        style={{ width: '40px' }}
                    />
                    <Column
                        field="medicamento"
                        header="Medicamento"
                        style={{ width: '550px' }}
                        body={row => {
                            const found = mezclas.find(m => m.value === row.medicamento);
                            return found ? found.label : row.medicamento;
                        }} />
                    <Column
                        field="cantidad"
                        header="Cantidad"
                        sortable
                        editor={numberEditor}
                        style={{
                            width: '180px'
                        }}
                    />
                    <Column field="dosisPrescrita"
                        header="Dosis"
                        sortable
                        body={rowData =>
                            rowData.dosisPrescrita != null
                                ? `${rowData.dosisPrescrita}`
                                : ''
                        }
                        editor={numberEditor}
                        style={{
                            width: '210px'
                        }} />
                    <Column field="observacion" header="Observaci&oacute;n" style={{
                        width: '180px'
                    }} />
                </DataTable>
            </div>
        );
    };

    const renderTablaConsulta = () => {
        const data = consultaRows;
        return (
            <div className="tabla-container">
                <DataTable
                    value={data}
                    scrollable
                    scrollHeight="350px"
                    removableSort
                    showGridlines
                    tableStyle={{ tableLayout: 'fixed' }}
                    sortField="csc"
                    sortOrder={1}
                    selection={seleccionConsulta}
                    onSelectionChange={(e) => {
                        const soloValidas = (e.value || []).filter(r => r.cancelable);
                        setSeleccionConsulta(soloValidas);
                    }}
                    isDataSelectable={(event) => !!event.data.cancelable}
                    rowClassName={(row) => ({ 'row-nocancel': !row.cancelable })}
                    emptyMessage={emptyMess}
                >

                    {/* Sin botones de eliminar/editar en consulta */}
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="Csc" header="Item" style={{ width: '65px' }} />
                    <Column field="Id" header="#" style={{ width: '40px' }} />
                    <Column field="medicamento"
                        header="Medicamento"
                        style={{ width: '550px' }}
                        body={row => {
                            const found = mezclas.find(m => m.value === row.medicamento);
                            return found ? found.label : row.medicamento;
                        }} />
                    <Column field="Cantidad" header="Cantidad" sortable style={{ width: '130px' }} />
                    <Column field="DosisPrescrita" header="Dosis" sortable style={{ width: '120px' }} />
                    <Column field="Observacion" header="Observación" style={{ width: '180px' }} />
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

        );
    };

    //RETURN
    return (
        <div className="page">
            <div className="panel">
                <h2>Solicitudes</h2>
                <div className="btn-group flex-wrap">
                    <Button label="Nuevo" icon="pi pi-plus" className="btn-lg btn-success" onClick={handleNew} />
                    <Button label="Consulta" icon="pi pi-search" className="btn-lg btn-success" onClick={handleSearch} />
                    <Button label="Limpiar" icon="pi pi-trash" className="btn-lg btn-success" onClick={handleClear} />
                    <Button label="Agregar" icon="pi pi-file-plus" className="btn-lg btn-success" disabled={vista === 'consulta'} onClick={handleAdd} />
                    <Button label="Guardar" icon="pi pi-save" className="btn-lg btn-success" disabled={vista === 'consulta'} onClick={handleSave} />
                    <Button label="Exportar" icon="pi pi-file-export" disabled className="btn-lg btn-success" />
                </div>

                <div className="content">
                    <div style={{ marginBottom: '1rem ' }}>
                        <div className="filter-container">
                            <Card>
                                <div className=" p-fluid form-grid-solicitudes">

                                    <div className="p-field soldiv1">
                                        <FloatLabel>
                                            <Dropdown
                                                id="servicio"
                                                ref={servicioRef}
                                                options={servicios}
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Seleccione "
                                                value={form.servicio}
                                                onChange={e => {
                                                    const sel = servicios.find(s => s.value === e.value);
                                                    setForm({ ...form, servicio: e.value, nomServicio: sel?.label });
                                                    setLastServicio(e.value);
                                                    if (lastService) sessionStorage.setItem(lastService, e.value);
                                                    setTimeout(() => medicamentoRef.current?.focus(), 100);
                                                }}
                                                filter
                                                appendTo="self"
                                                disabled={servicioBloqueado}
                                            />
                                            <label>Servicio</label>
                                        </FloatLabel>
                                    </div>

                                    <div className="p-field soldiv2">
                                        <Dropdown
                                            ref={medicamentoRef}
                                            id="medicamento"
                                            options={mezclas}
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Seleccione medicamento"
                                            value={form.medicamento}
                                            onChange={e => {
                                                setForm(f => ({ ...f, medicamento: e.value }));
                                                setTimeout(() => cantidadRef.current?.focus(), 100);
                                            }}
                                            filter
                                            appendTo="self"
                                            disabled={vista === 'consulta'}
                                        />
                                    </div>

                                    <div className="p-field soldiv3">
                                        <FloatLabel>
                                            <InputNumber
                                                ref={cantidadRef}
                                                id="cantidad"
                                                value={form.cantidad}
                                                onChange={e => setForm({ ...form, cantidad: e.value })}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        dosisRef.current?.focus();
                                                    }
                                                }}
                                                disabled={vista === 'consulta'}
                                            />
                                            <label>Cantidad</label>
                                        </FloatLabel>
                                    </div>

                                    <div className="p-field soldiv4">
                                        <FloatLabel>
                                            <InputNumber
                                                inputRef={dosisRef}
                                                id="dosis"
                                                suffix={` ${unidadDosis}`}
                                                placeholder={` ${unidadDosis}`}
                                                value={form.dosis}
                                                onChange={e => setForm({ ...form, dosis: e.value })}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        observacionRef.current.focus();
                                                    }
                                                }}
                                                disabled={vista === 'consulta'}
                                            />
                                            <label>Dosis</label>
                                        </FloatLabel>
                                    </div>

                                    <div className="p-field soldiv5">
                                        <FloatLabel>
                                            <InputText
                                                ref={observacionRef}
                                                id="observacion"
                                                value={form.observacion}
                                                onChange={e => setForm(f => ({ ...f, observacion: e.target.value }))}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAdd();
                                                    }
                                                }}
                                                disabled={vista === 'consulta'}
                                            />
                                            <label>Observaci&oacute;n</label>
                                        </FloatLabel>
                                    </div>

                                </div>

                            </Card>

                        </div>
                    </div>
                    <div style={{ marginTop: '2rem ' }}>
                        {vista === 'nuevo' ? rendertabla() : renderTablaConsulta()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Solicitudes;