import React, { useState, useEffect, useRef, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Sidebar } from 'primereact/sidebar';
import { Tooltip } from 'primereact/tooltip';
import { InputTextarea } from 'primereact/inputtextarea';
import { Fieldset } from 'primereact/fieldset';
import { FloatLabel } from 'primereact/floatlabel';
import { withSwalLoading, swalMensaje, swalMissing } from '../../utils/SwalUtils'
import { postOrdenProduccion, updateOrdenProduccion, cancelarOrdenProduccion } from '../../services/produccionService';
import '../../styles/ProduccionModal.css';

const ProduccionModal = ({ visible, onHide, data = {}, onSave, user }) => {

    //HOOKS
    const [estado, setEstado] = useState('');
    const [etiqueta, setEtiqueta] = useState('');
    const [orden, setOrden] = useState('');

    //ETIQUETA
    const etiDefault = {
        Estado: '',
        MotivoDevolucion: '',
        Fotosensible: 'N',
        VehiculoReconst: '',
        VolReconst: '',
        ConcReconst: '',
        FLU: null,
        VehiculoDilu: '',
        VolDilu: '',
        ConcDilu: '',
        LeyendaAlm: '',
        LeyendaAdm: '',
        Color: '',
        Obs: '',    // Observación del ordenamiento 
        ObsProc: ''
    }

    const vehiculos = [
        { label: 'No aplica', value: '1' },
        { label: 'Solución salina 0,9%', value: '2' },
        { label: 'Agua esteril', value: '3' },
        { label: 'Dextrosa 5%', value: '4' },
    ];
    const leyendas = [
        { label: 'ADMINISTRAR MINIMO EN 60 MINUTOS, EN MENOR TIEMPO PUEDE CAUSAR REACCIONES ADVERSAS', value: '1' },
        { label: 'ADMINISTRAR MINIMO EN 30 MINUTOS, EN MENOR TIEMPO PUEDE CAUSAR REACCIONES ADVERSAS', value: '2' },
        { label: 'ALMACENAR ENTRE 2°C a 8°C', value: '4' },
        { label: 'ALMACENAR A TEMPERATURA AMBIENTE CONTROLADA', value: '5' },
    ];
    const colores = [
        { label: 'Amarilla', value: '1' },
        { label: 'Blanco', value: '2' },
        { label: 'Morado', value: '3' },
    ];

    //Refs
    const vehiculoReconstRef = useRef(null);
    const volReconstRef = useRef(null);
    const concReconstRef = useRef(null);
    const vehiculoDilutRef = useRef(null);
    const volDilutRef = useRef(null);
    const concDiluRef = useRef(null);
    const colorRef = useRef(null);
    const leyAlmRef = useRef(null);
    const leyAdmRef = useRef(null);
    const obsRef = useRef(null);

    const initialEtiquetaRef = useRef(null);

    //Validacion
    const camposObligatorios = [
        { key: 'VehiculoReconst', label: 'Vehículo de Reconstitución', ref: vehiculoReconstRef },
        { key: 'VolReconst', label: 'Volumen de Reconstitución', ref: volReconstRef },
        { key: 'ConcReconst', label: 'Concentración de Reconstitución', ref: concReconstRef },
        { key: 'VehiculoDilu', label: 'Vehículo de Dilución', ref: vehiculoDilutRef },
        { key: 'VolDilu', label: 'Volumen de Dilución', ref: volDilutRef },
        { key: 'ConcDilu', label: 'Concentración de Dilución', ref: concDiluRef },
        { key: 'Color', label: 'Color', ref: colorRef },
        { key: 'LeyendaAlm', label: 'Leyenda de Almacenamiento', ref: leyAlmRef },
        { key: 'LeyendaAdm', label: 'Leyenda de Administración', ref: leyAdmRef },
    ];

    //CARGAR INFORMACION INICIAL
    useEffect(() => {
        if (!data) return;
        const { etiquetaData, ...row } = data;
        console.log("data", data)
        const nuevaEti = etiquetaData ? {
            Estado: row.NomEstado,
            MotivoDevolucion: etiquetaData.MotDev,
            Fotosensible: etiquetaData.FotoSen,
            VehiculoReconst: etiquetaData.VehRec,
            VolReconst: etiquetaData.VolRec,
            ConcReconst: etiquetaData.ConRec,
            FLU: etiquetaData.Flu ? new Date(etiquetaData.Flu) : null,
            VehiculoDilu: etiquetaData.VehDil,
            VolDilu: etiquetaData.VolDil,
            ConcDilu: etiquetaData.ConDil,
            Via: row.Via,
            LeyendaAlm: etiquetaData.LeyAlm,
            LeyendaAdm: etiquetaData.LeyAdm,
            Color: etiquetaData.Color,
            Obs: etiquetaData.Obs,
            ObsProc: etiquetaData.ObsProc
        } : { ...etiDefault, Via: data.Via, Obs: data.Obs };

        console.log("nuevaEti", nuevaEti)

        initialEtiquetaRef.current = nuevaEti;
        setOrden(row);
        setEtiqueta(nuevaEti);

    }, [data]);

    // Revisar si hubo cambios
    const isDirty = useMemo(() => {
        const etiquetaChanged =
            JSON.stringify(etiqueta) !== JSON.stringify(initialEtiquetaRef.current);
        return etiquetaChanged;
    }, [etiqueta]);

    // Guardar información
    const handleGuardar = async () => {
        const faltantes = camposObligatorios
            .filter(c => !etiqueta[c.key] || String(etiqueta[c.key]).trim() === '');

        const labels = faltantes.map(c => c.label).join(', ');
        const primer = faltantes[0];

        if (faltantes.length > 0) {
            swalMissing(labels, primer);
            return;
        }
        console.log("orden", orden)
        console.log("etiqueta", etiqueta)
        const nuevaOrden = {
            ...orden,
            ...etiqueta,
            Estado: estado
        };
        console.log("nuevaOrden antes de enviar al post", nuevaOrden)
        withSwalLoading('Cargando informaci\u00F3n')
        try {
            if (orden.EstCod == 1) {
                const response = await postOrdenProduccion(nuevaOrden, user);
                onSave(response);
                onHide();
                Swal.close();

            } else {
                const response = await updateOrdenProduccion(nuevaOrden, user);
                onSave(response);
                onHide();
                Swal.close();
            }
        } catch (err) {
            swalMensaje('error', err.message || 'No se pudo guardar');
            console.error('Error al guardar la orden:', err);
        }
    };
    //Cancelar orden
    const handleCancelar = async () => {
        try {
            const response = await cancelarOrdenProduccion(orden, user);
            onSave(response);
            onHide();
        } catch (err) {
            console.error('Error al cancelar la orden:', err);
            alert("No se pudo cancelar la orden. Revisa la consola.");
        }
    };
    //Reasignar orden


    //RETURN
    return (
        <>
            <Sidebar
                header={`${orden.TipdeDoc} ${orden.Documento} - ${orden.NombreCompleto} - ${orden.Edad} años - HAB ${orden.Habitacion} `}
                visible={visible}
                onHide={onHide}
                position="right"
                style={{ width: '100vw' }}
                blockScroll={true}
                showCloseIcon={true}
            >
                {orden && (

                    <div className="modal-produccion">
                        { /*Información del medicamento */}
                        <div >
                            <Fieldset legend="Informacion del medicamento">
                                <div className="form-grid-prodmodinfo">

                                    <div className="p-field prodmoddiv1">
                                        <label className="label">{orden.NombreMedicamento}</label>
                                    </div>

                                    <div className="p-field prodmoddiv2">
                                        <label className="label">Frecuencia:</label>   <span className="text">{orden.Frecuencia}</span>
                                    </div>

                                    <div className="p-field prodmoddiv3">
                                        <label className="label">Dosis 24H:  </label>   <span className="text">{orden.Dosis24H}</span>
                                    </div>

                                    <div className="p-field prodmoddiv4">
                                        <label className="label">Dosis Total 24H:  </label>   <span className="text">{`${orden.DosisTotal24H} ${orden.Unidad} `}</span>
                                    </div>

                                    <div className="p-field prodmoddiv5">
                                        <label className="label">Dosis Min Presentaci&oacute;n:  </label>  <span className="text">{`${orden.DosisMinPresentacion} ${orden.Unidad} `}</span>
                                    </div>

                                    <div className="p-field prodmoddiv6">
                                        <label className="label">Dosis Prescrita:  </label>  <span className="text">{`${orden.DosisPrescrita} ${orden.Unidad} `}</span>
                                    </div>

                                    <div className="p-field prodmoddiv7">
                                        <label className="label">Dosis en MG:  </label>  <span className="text">{`${orden.DosisMG} ${orden.Unidad === "GR" ? "MG" : orden.Unidad}`}</span>
                                    </div>

                                    <div className="p-field prodmoddiv8">
                                        <label className="label">Hora:  </label>   <span className="text"> {orden.FechaHora ? orden.FechaHora.split(' ')[1]?.substring(0, 8) : ''}</span>
                                    </div>
                                </div>
                            </Fieldset>
                        </div>

                        { /*Información de la etiqueta */}
                        {/*<div className="modal-btn">*/}
                        {/*    <Button*/}
                        {/*        label="Reasignar"*/}
                        {/*        className="btn-save"*/}
                        {/*        onClick={handleGuardar}*/}
                        {/*        disabled={!isDirty}*/}
                        {/*    />*/}
                        {/*</div>*/}
                        <div className="info_etiqueta">
                            <Card>
                                {/*Estado*/}
                                <div className=" p-fluid  form-grid-prodmodetq">
                                    <div className="p-field prodetqdiv1">
                                        <FloatLabel>
                                            <InputText value={orden.NomEstado} disabled />
                                            <label >Estado </label>
                                        </FloatLabel>
                                    </div>
                                    {/*Motivo de devolución*/}
                                    <div className="p-field prodetqdiv2">
                                        <FloatLabel>
                                            <InputText
                                                value={etiqueta.MotivoDevolucion || ''}
                                                className={!orden.MotivoDevolucion || orden.MotivoDevolucion === '' ? 'dropdown-bloqueado' : ''}
                                                disabled
                                            />
                                            <label className={!orden.MotivoDevolucion || orden.MotivoDevolucion === '' ? 'label-bloqueado' : ''}>Motivo de devoluci&oacute;n</label>
                                        </FloatLabel>
                                    </div>
                                    {/*Fotosensible*/}
                                    <div className="p-field prodetqdiv3" >
                                        <Checkbox
                                            inputId="fotosensible"
                                            checked={etiqueta.Fotosensible === 'S'}
                                            onChange={e =>
                                                setEtiqueta({ ...etiqueta, Fotosensible: e.checked ? "S" : "N" })
                                            }
                                        />
                                        <label htmlFor="fotosensible" className="ml-2">Preparaci&oacute;n fotosensible</label>
                                    </div>
                                    {/*Color*/}
                                    <div className="p-field prodetqdiv4">
                                        <FloatLabel>
                                            <Dropdown
                                                ref={colorRef}
                                                value={etiqueta.Color}
                                                options={colores}
                                                appendTo="self"
                                                onChange={e => {
                                                    setEtiqueta({ ...etiqueta, Color: e.value })
                                                    setTimeout(() => vehiculoReconstRef.current?.focus(), 100);
                                                }}
                                            />
                                            <label>Color</label>
                                        </FloatLabel>
                                    </div>
                                    {/*Vehiculo de Reconstitucion*/}
                                    <div className="p-field prodetqdiv5">
                                        <FloatLabel>
                                            <Dropdown
                                                ref={vehiculoReconstRef}
                                                value={etiqueta.VehiculoReconst}
                                                options={vehiculos}
                                                appendTo="self"
                                                onChange={e => {
                                                    setEtiqueta({ ...etiqueta, VehiculoReconst: e.value });
                                                    setTimeout(() => volReconstRef.current?.focus(), 100);
                                                }}

                                            />
                                            <label>Veh&iacute;culo de reconstituci&oacute;n</label>
                                        </FloatLabel>
                                    </div>
                                    {/*Volumen de reconstitucion*/}
                                    <div className="p-field prodetqdiv6">
                                        <FloatLabel>
                                            <InputNumber
                                                ref={volReconstRef}
                                                value={etiqueta.VolReconst || ''}
                                                onChange={e => setEtiqueta({ ...etiqueta, VolReconst: e.value })}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        vehiculoDilutRef.current?.focus();
                                                    }
                                                }}
                                            />
                                            <label>Volumen de reconstituci&oacute;n</label>
                                        </FloatLabel>
                                    </div>
                                    {/*Concentracion de reconstitucion*/}
                                    <div className="p-field prodetqdiv7">
                                        <FloatLabel>
                                            <InputNumber
                                                ref={concReconstRef}
                                                value={etiqueta.ConcReconst}
                                                onChange={e => setEtiqueta({ ...etiqueta, ConcReconst: e.value })}
                                            />
                                            <label>Concentraci&oacute;n de reconstituci&oacute;n</label>
                                        </FloatLabel>
                                    </div>
                                    {/*FLU*/}
                                    <div className="p-field prodetqdiv8">
                                        <FloatLabel>
                                            <Calendar
                                                appendTo="self"
                                                value={etiqueta.FLU}
                                                onChange={e => setEtiqueta({ ...etiqueta, FLU: e.value })} dateFormat="yy/mm/dd" />
                                            <label>FLU</label>
                                        </FloatLabel>
                                    </div>
                                    {/*Vehiculo de dilucion*/}
                                    <div className="p-field prodetqdiv9">
                                        <FloatLabel>
                                            <Dropdown
                                                ref={vehiculoDilutRef}
                                                value={etiqueta.VehiculoDilu}
                                                appendTo="self"
                                                options={vehiculos}
                                                onChange={e => {
                                                    setEtiqueta({ ...etiqueta, VehiculoDilu: e.value })
                                                    setTimeout(() => volDilutRef.current?.focus(), 100);
                                                }} />
                                            <label>Veh&iacute;culo de diluci&oacute;n</label>
                                        </FloatLabel>
                                    </div>
                                    {/*Volumen de dilucion*/}
                                    <div className="p-field prodetqdiv10">
                                        <FloatLabel>
                                            <InputNumber
                                                ref={volDilutRef}
                                                value={etiqueta.VolDilu || ''}
                                                onChange={e => setEtiqueta({ ...etiqueta, VolDilu: e.value })}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        leyAlmRef.current?.focus();
                                                    }
                                                }} />
                                            <label>Volumen de diluci&oacute;n</label>
                                        </FloatLabel>
                                    </div>
                                    {/*Concentracion de dilucion*/}
                                    <div className="p-field prodetqdiv11">
                                        <FloatLabel>
                                            <InputNumber
                                                ref={concDiluRef}
                                                value={etiqueta.ConcDilu}
                                                onChange={e => setEtiqueta({ ...etiqueta, ConcDilu: e.value })} />
                                            <label>Concentraci&oacute;n de diluci&oacute;n</label>
                                        </FloatLabel>
                                    </div>

                                    {/*VIA*/}
                                    <div className="p-field prodetqdiv12">
                                        <FloatLabel>
                                            <InputText
                                                value={orden.Via}
                                                disabled />
                                            <label>V&iacute;a</label>
                                        </FloatLabel>
                                    </div>

                                    {/*Leyenda almacenamiento*/}
                                    <div className="p-field prodetqdiv13">
                                        <FloatLabel>
                                            <Dropdown
                                                ref={leyAlmRef}
                                                value={etiqueta.LeyendaAlm}
                                                appendTo="self"
                                                options={leyendas} onChange={e => {
                                                    setEtiqueta({ ...etiqueta, LeyendaAlm: e.value })
                                                    setTimeout(() => leyAdmRef.current?.focus(), 100);
                                                }} />
                                            <label>Leyenda almacenamiento</label>
                                        </FloatLabel>
                                    </div>
                                    {/*Leyenda administracion*/}
                                    <div className="p-field prodetqdiv14">
                                        <FloatLabel>
                                            <Dropdown
                                                ref={leyAdmRef}
                                                value={etiqueta.LeyendaAdm}
                                                appendTo="self"
                                                options={leyendas} onChange={e => {
                                                    setEtiqueta({ ...etiqueta, LeyendaAdm: e.value })
                                                    setTimeout(() => obsRef.current?.focus(), 100);
                                                }} />
                                            <label>Leyenda administraci&oacute;n</label>
                                        </FloatLabel>
                                    </div>

                                </div>

                                {/*Observacion*/}
                                <div className="p-fluid" style={{ marginTop: '2rem' }}>
                                    <div className="p-field ">
                                        <FloatLabel>
                                            <InputTextarea
                                                autoResize
                                                rows={3}
                                                style={{ overflowY: 'auto' }}
                                                ref={obsRef}
                                                value={etiqueta.ObsProc}
                                                onChange={e => setEtiqueta({ ...etiqueta, ObsProc: e.target.value })}
                                            />
                                            <label>Observaci&oacute;n</label>
                                        </FloatLabel>
                                    </div>
                                </div>

                                <div className="p-fluid" style={{ marginTop: '2rem' }}>
                                    <div className="p-field ">
                                        <FloatLabel>
                                            <InputTextarea
                                                autoResize
                                                rows={3}
                                                style={{ overflowY: 'auto' }}
                                                ref={obsRef}
                                                value={etiqueta.Obs}
                                                placeholder=" "
                                                disabled
                                            />
                                            <label>Observaci&oacute;n del ordenamiento</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </Card>
                            <div className="modal-btn">
                                <Button
                                    label="Cerrar"
                                    className="btn-cerrar"
                                    onClick={onHide}
                                />
                                <Button
                                    label="Cancelar"
                                    className="btn-cancel"
                                    onClick={handleCancelar}
                                    disabled={orden.EstCod == "1"}
                                />
                                <Button
                                    label="Guardar"
                                    className="btn-save"
                                    onClick={handleGuardar}
                                    disabled={!isDirty}
                                />
                            </div>
                        </div>
                    </div>

                )}
            </Sidebar>
        </>
    );
};

export default ProduccionModal;
