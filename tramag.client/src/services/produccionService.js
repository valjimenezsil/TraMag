

//Formatear fecha
const formatFechaSQL = (fecha) => {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;
};

//ORDENES DE PRODUCCION
export const fetchOrdenesProduccion = async (empresa, sede, servicio) => {
    if (!empresa || !sede || !servicio) {
        throw new Error('fetchOrdenesProduccion: falta empresa o sede o servicio');
    }

    const params = new URLSearchParams({ empresa, sede, servicio }).toString();
    try {
        const res = await fetch(`/Produccion/GetOrdenes?${params}`);
        if (!res.ok) {
            // Error HTTP explícito
            throw new Error(`Error HTTP ${res.status} al obtener órdenes`);
        }
        const data = await res.json();
        const dataParse = JSON.parse(data.response)
        console.log("Ordenes de Prod", dataParse)
        if (!data.response) {
            throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
        }
        return dataParse;

    } catch (error) {
        console.error("Error en fetchOrdenesProduccion:", error);
        throw new Error(`No se pudo obtener Ordenes de produccion: ${error.message}`);
    }
};

//INSERTAR DATOS DE ETIQUETA NUEVA
export const postOrdenProduccion = async (orden, user) => {
    console.log("ProduccionServices", orden)
    const ahora = new Date();
    const payload = {

        Empresa: orden.Empresa,
        Sede: orden.Sede,
        Servicio: orden.Servicio,
        Ingreso: orden.Ingreso,
        Folio: orden.Folio,
        TipoIde: orden.TipdeDoc,
        Ide: orden.Documento,
        MSCodi: orden.MSCODI || "",
        MSPrAc: orden.MSPRAC || "",
        CncCd: orden.CNCCD || "",
        MSForm: orden.MSFORM || "",
        ProcEst: "2",
        Estado: "0",
        ImpEst: "1",
        UsuAdd: user.usuario,
        FecAdd: formatFechaSQL(ahora),
        UsuMod: null,
        FecMod: null,


        // TraMagEti
        CscSol: orden.CscSol,
        IdSol: orden.Id,
        MotDev: '1',
        FotoSen: orden.Fotosensible,
        Color: orden.Color || "",
        VehRec: orden.VehiculoReconst || "",
        VolRec: orden.VolReconst || "",
        ConRec: orden.ConcReconst || "",
        VehDil: orden.VehiculoDilu || "",
        VolDil: orden.VolDilu || "",
        ConDil: orden.ConcDilu || "",
        Via: orden.Via || "",
        Flu: orden.FLU ? formatFechaSQL(new Date(orden.FLU)) : null,
        LeyAlm: orden.LeyendaAlm || "",
        LeyAdm: orden.LeyendaAdm || "",
        NomPac: orden.NombreApellido || "",
        Hab: orden.Habitacion || "",
        DosPre: orden.DosisPrescrita || 0,
        Dosis24H: orden.Dosis24H || 0,
        ObsProc: orden.ObsProc || "",
        Obs: orden.Obs || ""

    };
    try {

        const response = await fetch(`/Produccion/InsertTraMagPro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Respuesta detallada:', errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

//ACTUALIZAR ETIQUETA   
export const updateOrdenProduccion = async (orden, user) => {
    const ahora = new Date();
    const payload = {
        Empresa: orden.Empresa,
        Sede: orden.Sede,
        Csc: orden.Csc,
        Servicio: orden.Servicio,
        Ingreso: orden.Ingreso,
        Folio: orden.Folio,
        TipoIde: orden.TipdeDoc,
        Ide: orden.Documento,
        MSCodi: orden.MSCODI || "",
        MSPrAc: orden.MSPRAC || "",
        CncCd: orden.CNCCD || "",
        MSForm: orden.MSFORM || "",
        ProcEst: "2",
        Estado: "0",
        ImpEst: "1",
        UsuAdd: user.usuario,
        FecAdd: formatFechaSQL(ahora),
        UsuMod: null,
        FecMod: null,


        // TraMagEti
        MotDev: orden.MotDev || "",
        FotoSen: orden.Fotosensible,
        Color: orden.Color || "",
        VehRec: orden.VehiculoReconst || "",
        VolRec: orden.VolReconst || "",
        ConRec: orden.ConcReconst || "",
        VehDil: orden.VehiculoDilu || "",
        VolDil: orden.VolDilu || "",
        ConDil: orden.ConcDilu || "",
        Flu: orden.FLU ? formatFechaSQL(new Date(orden.FLU)) : null,
        LeyAlm: orden.LeyendaAlm || "",
        LeyAdm: orden.LeyendaAdm || "",
        Obs: orden.Obs || ""

    };
    try {
        const response = await fetch(`/Produccion/UpdateTraMagPro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Respuesta detallada:', errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

//OBTENER DATOS DE ETIQUETA
export const fetchDatosEtiquetas = async (empresa, sede, csc) => {
    if (!empresa || !sede || !csc) {
        throw new Error('fetchDatosEtiquetas: falta empresa o sede o csc');
    }
    const params = new URLSearchParams({ empresa, sede, csc }).toString();
    try {
        const res = await fetch(`/Produccion/GetTraMag1?${params}`);
        if (!res.ok) {
            // Error HTTP explícito
            throw new Error(`Error HTTP ${res.status} al obtener info de tragmag1`);
        }
        const data = await res.json();
        const dataParse = JSON.parse(data.response)
        if (!data.response) {
            throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
        }
        return dataParse;

    } catch (error) {
        console.error("Error en fetchDatosEtiquetas:", error);
        throw new Error(`No se pudo obtener info de tragmag1: ${error.message}`);
    }
};

//CANCELAR ORDEN
export const cancelarOrdenProduccion = async (orden, user) => {
    const ahora = new Date();
    const payload = {
        Empresa: orden.Empresa,
        Sede: orden.Sede,
        Csc: orden.Csc,
        UsuMod: user.usuario,
    }
    try {
        const response = await fetch(`/Produccion/CancelTraMagPro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Respuesta detallada:', errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

//IMPRIMIR ETIQUETA
export const imprimirEtiqueta = async (color, qf1, qf2, ordenes) => {
    const ordenesMapped = ordenes.map(r => ({
        Empresa: r.Empresa,
        Sede: r.Sede,
        Csc: r.Csc
    }))
    try {
        const response = await fetch(`/Produccion/GetTraMag1Eti`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ordenesMapped)
        });
        console.log("respuesta del post de impresion", response)
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Respuesta detallada:', errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        const dataParse = JSON.parse(data.response)

        console.log("dataParse", dataParse)

        const dataEti = dataParse.filter(d => d.color == color).map(d => ({
            ...d,
            lote: "Esperando",
            qfPreparacion: qf1,
            qfCalidad: qf2,
            version: "02"
        }))

        if (dataEti.length === 0) {
            throw new Error('No hay etiquetas para el color seleccionado. Verifique el color.');
        }

        const resultado = dataEti.flatMap(item =>
            Array.from({ length: item.FotoSen === "S" ? item.cantidad * 2 : item.cantidad }, () => ({
                cliente: item.cliente,
                nomMezcla: item.nomMezcla,
                dosisMezcla: item.dosisMezcla,
                vehiculoDilucion: item.vehiculoDilucion,
                volumen: item.volumen,
                via: item.via,
                paciente: item.paciente,
                habitacion: item.habitacion,
                leyAlmacenamiento: item.leyAlmacenamiento,
                leyAdministracion: item.leyAdministracion,
                flu: item.Flu,
                lote: item.lote,
                qfPreparacion: item.qfPreparacion,
                qfCalidad: item.qfCalidad,
                version: item.version
            }))
        );
        console.log("resultado",resultado)
        return resultado;
    }
    catch (error) {
        console.error("Error en imprimirEtiqueta:", error);
        throw new Error(`No se pudo imprimir la etiqueta: ${error.message}`);
    }
};