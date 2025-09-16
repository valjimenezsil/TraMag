import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { imprimirEtiqueta } from "../../services/produccionService";

const ImpresionModal = ({ visible, onHide, onImprimir, data }) => {
    const [colorEtiqueta, setColorEtiqueta] = useState(null);
    const [qfPreparacion, setQfPreparacion] = useState("");
    const [qfCalidad, setQfCalidad] = useState("");

    const colores = data.colores;
    const qfPrep = data.qf;
    const qfCal = data.qf;

    const handlePrint = async () => {
        try {
            const lista = await imprimirEtiqueta(
                colorEtiqueta,
                qfPreparacion,
                qfCalidad,
                data.seleccionImpresion
            );
            onImprimir({ ok: true, lista });
        } catch (error) {
            onImprimir({ ok: false, error });
        }
    };
    const footer = (
        <div>
            <Button
                label="Cancelar" icon="pi pi-times" className="btn-cancel" onClick={onHide} />
            <Button
                label="Imprimir"
                icon="pi pi-print"
                className="btn-save"
                onClick={handlePrint}
                disabled={!colorEtiqueta || !qfPreparacion || !qfCalidad}
            />
        </div>
    );

    return (
        <Dialog
            header="Impresi&oacute;n de etiqueta"
            visible={visible}
            style={{ width: "30rem" }}
            modal
            onHide={onHide}
            footer={footer}
            blockScroll={true}
            draggable={false}
        >
            <div className="modal-impresion">
                <div>
                    <FloatLabel>
                        <Dropdown
                            id="colorEtiqueta"
                            value={colorEtiqueta}
                            options={colores}
                            onChange={(e) => setColorEtiqueta(e.value)}
                            className="w-full"
                        />
                        <label htmlFor="colorEtiqueta">Color de la etiqueta</label>
                    </FloatLabel>
                </div>
                <div>
                    <FloatLabel>
                        <Dropdown
                            id="qfPrep"
                            value={qfPreparacion}
                            options={qfPrep}
                            onChange={(e) => setQfPreparacion(e.value)}
                            className="w-full"
                        />
                        <label htmlFor="qfPreparacion">QF de preparaci&oacute;n</label>
                    </FloatLabel>
                </div>
                <div>
                    <FloatLabel>
                        <Dropdown
                            id="qfCal"
                            value={qfCalidad}
                            options={qfCal}
                            onChange={(e) => setQfCalidad(e.value)}
                            className="w-full"
                        />
                        <label htmlFor="qfCalidad">QF de calidad</label>
                    </FloatLabel>
                </div>
            </div>
        </Dialog>
    );
};

export default ImpresionModal;