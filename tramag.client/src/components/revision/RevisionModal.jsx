import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from 'primereact/floatlabel';
import { fetchEstados, fetchMotDev } from "../../services/maestrosService";
import { withSwalLoading, swalMensaje, swalMissing } from '../../utils/SwalUtils';
import '../../styles/Revision.css';

export default function RevisionModal({ visible, onHide, empresa, sede, servicio, orden }) {

    //ESTADO INICIAL DEL FORM
    const formRevision = {
        estado: '',
        motivoDev: '',
        Obs: '',
        ObsProc: '',
    }

    const formIzq = {
        medicamento: '',
        frecuencia: '',
        dosis24h: '',
        dosisUnitaria: '',
        via: '',
        color: '',
        habitacion: '',
        vehRec: '',
        volRec: '',
        conRec: '',
        vehDilu: '',
        volDilu: '',
        conDilu: '',
        fotoSen: ''
    }

    //HOOKS
    const [formRev, setFormRev] = useState(formIzq);
    const [form, setForm] = useState(formRevision);
    const [estados, setEstados] = useState([]);
    const [motDev, setMotDev] = useState([]);

    //HANDLERS
    const handleCancelar = async () => {
        try {
            onHide();
        } catch (err) {
            console.error('Error al cancelar la orden:', err);
            alert("No se pudo cancelar la orden. Revisa la consola.");
        }
    };

    const handleGuardar = async () => {
        try {
            onHide();
        } catch (err) {
            console.error('Error al cancelar la orden:', err);
            alert("No se pudo cancelar la orden. Revisa la consola.");
        }
    };


    useEffect(() => {
        if (!orden) { setFormRev(formIzq); return; }
        setFormRev({
            medicamento: orden.NombreMedicamento,
            frecuencia: orden.Frecuencia,
            dosis24h: orden.Dosis24H,
            dosisUnitaria: orden.DosPre,
            via: orden.Via,
            color: orden.ColNom,
            habitacion: orden.Hab,
            fotoSen: orden.FotoSen,


            // Reconstitución
            vehRec: orden.VehRec,
            volRec: orden.VolRec,
            conRec: orden.ConRec,

            // Dilución
            vehDilu: orden.VehDil,
            volDilu: orden.VolDil,
            conDilu: orden.ConDil,

            //Leyendas
            leyAdm: orden.LeyAdministracion,
            leyAlm: orden.LeyAlmacenamiento

        });

        setForm({
            ...form, ObsProc: orden.ObsProc, Obs: orden.Obs
        })
        console.log("orden revision modal", orden)
    }, [orden]);

    useEffect(() => {
        const loadAll = async () => {
            withSwalLoading('Cargando informaci\u00F3n')
            try {
                const estadosMapped = await fetchEstados('REV');
                setEstados(estadosMapped);

                const motDevMapped = await fetchMotDev();
                setMotDev(motDevMapped)

                Swal.close()
            }
            catch (err) {
                swalMensaje('warning', err.message)
            }
        }
        loadAll();
    }, []);

    return (
        <Sidebar
            header={`${orden?.TipoIde} ${orden?.Ide} - ${orden?.NombreCompleto} - ${orden?.Edad} a\u00F1os - HAB ${orden?.Hab} `}
            visible={visible}
            onHide={onHide}
            position="right"
            style={{ width: '100vw' }}
            blockScroll={true}
            showCloseIcon={true}
        >

            <div className="modal-revision">
                <div className="revision-info">
                    <Card>
                        <div className="rev-row" style={{ marginBottom: '2rem' }}>
                            <FloatLabel className="w-full">
                                <InputText
                                    id="medicamento"
                                    value={formRev.medicamento}
                                    className="w-full"
                                    disabled
                                    tooltipOptions={{ position: 'bottom' }}
                                    tooltip={formRev.medicamento} />
                                <label htmlFor="medicamento">Medicamento</label>
                            </FloatLabel>
                        </div>

                        <div className="rev-columns3">
                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputText id="frecuencia" value={formRev.frecuencia} className="w-full" disabled />
                                    <label htmlFor="frecuencia">Frecuencia</label>
                                </FloatLabel>
                            </div>

                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputText id="dosis24h" value={formRev.dosis24h} className="w-full" disabled />
                                    <label htmlFor="dosis24h">Dosis 24H</label>
                                </FloatLabel>
                            </div>

                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputText id="dosisUnitaria" value={formRev.dosisUnitaria} className="w-full" disabled />
                                    <label htmlFor="dosisUnitaria">Dosis Unitaria</label>
                                </FloatLabel>
                            </div>

                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputText id="via" value={formRev.via} className="w-full" disabled />
                                    <label htmlFor="via">V&iacute;a</label>
                                </FloatLabel>
                            </div>

                            <div style={{ alignContent: 'center' }} >
                                <Checkbox
                                    inputId="fotosensible"
                                    checked={formRev.fotoSen === 'S'}
                                    disabled
                                />
                                <label className="ml-2">Preparaci&oacute;n fotosensible</label>
                            </div>

                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputText id="color" value={formRev.color} className="w-full" disabled />
                                    <label htmlFor="via">Etiqueta</label>
                                </FloatLabel>
                            </div>
                        </div>


                        <div className="rev-columns">
                          

                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputText id="vehiculoReconst" value={formRev.vehRec} className="w-full" disabled />
                                    <label htmlFor="vehiculoReconst">Veh&iacute;culo de reconstituci&oacute;n</label>
                                </FloatLabel>
                            </div>

                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputText id="volumenReconst" value={formRev.volRec} className="w-full" disabled />
                                    <label htmlFor="volumenReconst">Volumen de reconstituci&oacute;n</label>
                                </FloatLabel>
                            </div>


                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputText id="conReconst" value={formRev.conRec} className="w-full" disabled />
                                    <label htmlFor="conReconst">Concentraci&oacute;n de reconstituci&oacute;n</label>
                                </FloatLabel>
                            </div>

                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputText id="vehiculoDilucion" value={formRev.vehDilu} className="w-full" disabled />
                                    <label htmlFor="vehiculoDilucion">Veh&iacute;culo de diluci&oacute;n</label>
                                </FloatLabel>
                            </div>

                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputText id="volDilucion" value={formRev.volDilu} className="w-full" disabled />
                                    <label htmlFor="volDilucion">Volumen de diluci&oacute;n</label>
                                </FloatLabel>
                            </div>

                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputText id="conDilucion" value={formRev.conDilu} className="w-full" disabled />
                                    <label htmlFor="conDilucion">Concentraci&oacute;n de diluci&oacute;n</label>
                                </FloatLabel>
                            </div>

                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputTextarea
                                        className="w-full"
                                        autoResize={false}
                                        rows={2}
                                        style={{
                                            overflow: 'auto',
                                            height: '100px',
                                            resize: 'none'
                                        }}
                                        value={formRev.leyAlm}
                                        disabled
                                    />
                                    <label htmlFor="leyAdm">Leyenda administraci&oacute;n</label>
                                </FloatLabel>
                            </div>

                            <div className="rev-row">
                                <FloatLabel className="w-full">
                                    <InputTextarea
                                        className="w-full"
                                        autoResize={false}
                                        rows={2}
                                        style={{
                                            overflow: 'auto',
                                            height: '100px',
                                            resize: 'none'
                                        }}
                                        value={formRev.leyAdm}
                                        disabled
                                    />
                                    <label htmlFor="leyAdm">Leyenda administraci&oacute;n</label>
                                </FloatLabel>
                            </div>

                        </div>
                    </Card>
                </div>

                {/*Lado derecho*/}
                <div className="revision-der">
                    <Card>
                        <div className="filter-rev">
                            <div className="rev-row" style={{ marginBottom: '2rem' }}>
                                <FloatLabel className="w-full">
                                    <Dropdown
                                        appendTo="self"
                                        options={estados}
                                        value={form.estado}
                                        className="w-full"
                                        onChange={e => {
                                            const nuevoEstado = e.value;
                                            if (nuevoEstado === '3') {
                                                setForm({ ...form, estado: nuevoEstado, motivoDev: '1' });
                                            } else {
                                                setForm({ ...form, estado: nuevoEstado, motivoDev: '' });
                                            }
                                        }}
                                    />

                                    <label >Estado </label>
                                </FloatLabel>
                            </div>
                            {/*Motivo de devolución*/}
                            <div className="rev-row" style={{ marginBottom: '2rem' }}>
                                <FloatLabel className="w-full">
                                    <Dropdown
                                        appendTo="self"
                                        options={motDev}
                                        value={form.motivoDev}
                                        className="w-full"
                                        disabled={form.estado === '3'}
                                        onChange={(e) => setForm({ ...form, motivoDev: e.value })}
                                    />
                                    <label >Motivo de devoluci&oacute;n</label>
                                </FloatLabel>
                            </div>
                            {/*Observacion*/}
                            <div className="rev-row" style={{ marginBottom: '2rem' }}>
                                <FloatLabel className="w-full">
                                    <InputTextarea
                                        className="w-full"
                                        autoResize={false}
                                        rows={3}
                                        style={{
                                            overflow: 'auto',
                                            height: '120px',
                                            resize: 'none'
                                        }}
                                        value={form.ObsProc}
                                        placeholder=" "
                                        onChange={f => setForm({ ...f, ObsProc: e.target.value })}
                                    />
                                    <label >Observaci&oacute;n</label>
                                </FloatLabel>
                            </div>

                            {/*Observacion de ordenamiento*/}
                            <div className="rev-row" style={{ marginBottom: '1rem' }}>
                                <FloatLabel className="w-full">
                                    <InputTextarea
                                        className="w-full"
                                        autoResize={false}
                                        rows={3}
                                        style={{
                                            overflow: 'auto',
                                            height: '120px',
                                            resize: 'none'
                                        }}
                                        value={form.Obs}
                                        placeholder=" "
                                        disabled
                                    />
                                    <label >Observaci&oacute;n de rdenamiento</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div className="modal-btn">
                            <Button
                                label="Cerrar"
                                className="btn-cerrar"
                                onClick={onHide}
                            />
                            <Button
                                label="Guardar"
                                className="btn-save"
                                onClick={handleGuardar}
                            />
                        </div>
                    </Card>
                </div>

            </div >
        </Sidebar >
    );
}
