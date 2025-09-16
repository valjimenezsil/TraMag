// Reportes.jsx
import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import ReporteOrdenDeProd from '@/components/reportes/ReporteOrdenDeProd.jsx';
import ReporteOrdenDeProdExt from '@/components/reportes/ReporteOrdenDeProdExt.jsx';

const opciones = [
    { label: "Reporte de \u00D3rdenes de Producci\u00F3n por fecha y servicio", value: "ordProd" },
    { label: "Reporte de \u00D3rdenes de Producci\u00F3n  de satelites y/o externos por fecha y servicio", value: "ordProdExt" }
];

const Reportes = () => {
    const [reporteSeleccionado, setReporteSeleccionado] = useState("ordenes");
    const renderReporte = () => {
        switch (reporteSeleccionado) {
            case "ordProd":
                return <ReporteOrdenDeProd />;
            case "ordProdExt":
                return <ReporteOrdenDeProdExt />;
            default:
                return null;
        }
    };


    return (
        <div className="page">
            <div className="panel">
                <h2>Reportes</h2>
                <div className="p-fluid">
                    <div style={{ marginBottom: "1rem" }}>
                        <Dropdown
                            options={opciones}
                            value={reporteSeleccionado}
                            onChange={e => setReporteSeleccionado(e.value)}
                            placeholder="Seleccione Reporte"
                        />
                    </div>
                </div>
                {renderReporte()}
            </div>
        </div>
    );
};

export default Reportes;