const formatFechaSQL = (fecha) => {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;
};

//payload que enviaré al post 
export const buildAlistamientoPayload = (rows = [], user) => {
    const { tipoPrep } = rows[0];
    return {
        prepCod: tipoPrep,
        usuAdd: user.usuario,
        entradas: rows.map(r => ({
            id: r.id,
            codProd: r.codigoProducto,
            nombre: r.producto,
            lote: r.lote,
            fechVenc: formatFechaSQL(r.fechaVencimiento),
            regInvima: r.registroINVIMA,
            cantSol: r.cantidad
        }))
    };
};
export const buildCancelarPayload = (rows = [], tipPrep, user) => {
    return {
        prepCod: tipPrep,
        usuMod: user.usuario,
        ent: rows.map(r => ({
            csc: r.Csc,
            id: r.Id
    }))
};
};


//INSERTAR ENTRADA
export const postEntrada = async (entrada, user) => {
    const payload = buildAlistamientoPayload(entrada, user);
    try {
        const response = await fetch(`/Alistamiento/InsertTraMagAli`, {
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
            message: "Entradas enviadas",
            data
        };

    } catch (error) {
        throw error;
    }
};

//OBTENER INFORMACION DE ENTRADA
export const fetchEntradas = async (prepcod) => {
    if (!prepcod) {
        throw new Error('Falta el tipo de preparación');
    }
    const params = new URLSearchParams({ prepcod }).toString();
    try {
        const res = await fetch(`/Alistamiento/GetTraMagAliLog?${params}`);
        if (!res.ok) {
            // Error HTTP explícito
            throw new Error(`Error HTTP ${res.status} al obtener el alistmaiento`);
        }
        const data = await res.json();
        const dataParse = JSON.parse(data.response)
        if (!data.response) {
            throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
        }
        if (dataParse === 0) {
            return dataParse;
        } else {
            const rows = dataParse.map(it => ({
                ...it,
                FechVenc: it.FechVenc ? it.FechVenc.split('T')[0] : ''
            }));
            return rows
        }
    } catch (error) {
        console.error("Error en fetchEntradas:", error);
        throw new Error(`No se pudo obtener las entradas del dia de hoy: ${error.message}`);
    }
};

//CANCELAR LA ENTRADA
export const cancelarEntrada = async (entradas, tipPrep, user) => {
    const payload = buildCancelarPayload(entradas, tipPrep, user);
    try {
        const response = await fetch(`/Alistamiento/CancelTraMagAli`, {
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
        console.log("data a canc", payload)
        return data;

    } catch (error) {
        throw error;
    }
}


