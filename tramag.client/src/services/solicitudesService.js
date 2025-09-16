

//FUNCION PARA REHACER EL OBJETO PARA ENVIAR UNA O VARIAS SOLICITUDES
export const buildSolicitudPayload = (rows = []) => {
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const { empresa, sede, servicio, usuAdd } = rows[0];

    return {
        empresa: empresa,
        sede: sede,
        servicio: servicio,         
        usuAdd:usuAdd,
        solicitudes: rows.map(r => ({
            id: r.id,
            nomServicio: r.nomServicio?.toString().trim(),
            msCodi: r.MSCodi?.toString().trim(),
            msPrAc: r.MSPrAc?.toString().trim(),
            cncCd: r.CncCd?.toString().trim(),
            msForm: r.MSForm?.toString().trim(),
            dosisPrescrita: r.dosisPrescrita != null ? Number(r.dosisPrescrita) : null,
            unidad: r.MSUni?.toString().trim(),                  
            dosisMinPresentacion: r.DosisMinPresentacion != null ? Number(r.DosisMinPresentacion) : null,
            cantidad: r.cantidad != null ? Number(r.cantidad) : 0,
            obs: r.observacion ?? ""
        }))
    };
};

//FUNCION PARA REHACER EL OBJETO PARA CANCELAR UNA O VARIAS SOLICITUDES
export const buildCancelarPayload = (rows = [],user) => {
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const { Empresa, Sede, Servicio, usuMod } = rows[0];

    return {
        empresa: Empresa,
        sede: Sede,
        servicio: Servicio,
        usuMod: user.usuario,
        solicitudes: rows.map(r => ({
            cscSol: r.Csc,
            id:r.Id
        }))
    };
};

//INSERTAR SOLICITUDES
export const postSolicitud = async (solicitud) => {
    const payload = buildSolicitudPayload(solicitud);
    console.log("Solicitud ya mapeada", payload)

    try {
        const response = await fetch(`/Solicitudes/InsertTraMagSolExt`, {
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

        const data = await response.json();
        return {
            message: "Solicitud enviada",
            data
        };

    } catch (error) {
        throw error;
    }

};

//FETCHSERVICIOSEXT
export const fetchServiciosExt = async (empresa, sede) => {
    if (!empresa || !sede) {
        throw new Error('fetchServicios: falta empresa o sede');
    }
    const params = new URLSearchParams({ empresa, sede }).toString();
    try {
        const res = await fetch(`/TraMag/GetServiciosExt?${params}`);
        if (!res.ok) {
            // Error HTTP explícito
            console.error('Respuesta general:', res);

            throw new Error(`Error HTTP ${res.status} al obtener servicios. Conexi\u00F3n a base de datos fall\u00F3`);
        }
        const data = await res.json();
        const dataParse = JSON.parse(data.response)
        if (!data.response) {
            throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
        }
        return dataParse.map(s => ({
            label: s.Nombre,
            value: s.Codigo
        }));
    } catch (error) {
        console.error("Error en fetchServiciosExt:", error);
        throw new Error(`No se pudo obtener servicios externos: ${error.message}`);
    }
};

//ORDENES EXTERNAS
export const fetchOrdenesExternas = async (empresa, sede, servicio) => {
    if (!empresa || !sede || !servicio) {
        throw new Error('fetchOrdenesExternas: falta empresa o sede o servicio');
    }

    const params = new URLSearchParams({ empresa, sede, servicio }).toString();
    try {
        const res = await fetch(`/Solicitudes/GetOrdenesExt?${params}`);
        if (!res.ok) {
            // Error HTTP explícito
            throw new Error(`Error HTTP ${res.message} al obtener órdenes externas`);
        }
        const data = await res.json();
        const dataParse = JSON.parse(data.response)
        console.log("Solicitudes externas buscadas",dataParse)
        if (!data.response) {
            throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
        }
        return dataParse;

    } catch (error) {
        console.error("Error en fetchOrdenesExternas:", error);
        throw new Error(`No se pudo obtener Ordenes externas: ${error.message}`);
    }
};

//CANCELAR ORDENES
export const cancelSolicitudesExt = async (solicitud,user) => {
    console.log("solicitudes a cancelar", solicitud)
    const payload = buildCancelarPayload(solicitud,user);
    console.log("solicitudes a cancelar despues de formatear", payload)
       
    try {
        const response = await fetch(`/Solicitudes/CancelSolicitudesExt`, {
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

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }

}

