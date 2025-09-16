//FETCHVEHICULOS
//export const fetchVehiculo = async () => {
//    const data = await apiFetch('Maestros/GetVehiculos');
//    const raw = data.response || [];
//    return raw.map(v => ({
//        label: v.VehCod,
//        value: v.VehNom
//    }));
//};




//FETCHMEZCLA


export const fetchMezclaData = async () => {
    const res = await fetch('/TraMag/GetMezclas');

    if (!res.ok) {
        // Error HTTP explícito
        throw new Error(`Error HTTP ${res.status} al obtener servicios`);
    }
    const data = await res.json();

    if (!data.response) {
        throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
    }

    const dataParse = JSON.parse(data.response)
    const dropdown = dataParse.map(m => ({
        label: m.MSDesc.trim(),
        value: [m.MSCodi, m.MSPrAc, m.CncCd, m.MSForm].join('-')
    }));
    return { raw: dataParse, dropdown };

}

// FETCHPRODUCTOS
export const fetchProductosData = async () => {

    const response = await fetch(`/TraMag/GetProductos`);
    if (!response.ok) {
        // Error HTTP explícito
        throw new Error(`Error HTTP ${response.status} al obtener productos`);
    }
    const data = await response.json();

    const dataParse = JSON.parse(data.response)
    console.log("productos", dataParse)

    if (!data.response) {
        throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
    }
    return dataParse;

};

//FETCHEMPRESAS
export const fetchEmpresas = async () => {
    const res = await fetch('/TraMag/GetEmpresas');
    if (!res.ok) {
        // Error HTTP explícito
        throw new Error(`Error HTTP ${res.status} al obtener servicios`);
    }
    const data = await res.json();
    const dataParse = JSON.parse(data.response)
    if (!data.response) {
        throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
    }
    return dataParse.map(e => ({
        label: e.EMPNombre,
        value: e.EMPCodigo
    }));
};

//FETCHSEDES
export const fetchSedes = async (empresa) => {
    if (!empresa) {
        throw new Error('Falta campo empresa');
    }
    const params = new URLSearchParams({ empresa }).toString();
    try {
        const res = await fetch(`/TraMag/GetSedes?${params}`);
        if (!res.ok) {
            // Error HTTP explícito
            throw new Error(`Error HTTP ${res.status} al obtener sedes`);
        }
        const data = await res.json();
        const dataParse = JSON.parse(data.response)
        if (!data.response) {
            throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
        }
        return dataParse.map(s => ({
            label: s.SedeNombre,
            value: s.SedeCodigo
        }));
    } catch (error) {
        console.error("Error en fetchSedes:", error);
        throw new Error(`No se pudo obtener sedes: ${error.message}`);
    }
};

//FETCHSERVICIOS
export const fetchServicios = async (empresa, sede) => {
    if (!empresa || !sede) {
        throw new Error('fetchServicios: falta empresa o sede');
    }
    const params = new URLSearchParams({ empresa, sede }).toString();
    try {
        const res = await fetch(`/TraMag/GetServicios?${params}`);
        if (!res.ok) {
            // Error HTTP explícito
            throw new Error(`Error HTTP ${res.status} al obtener servicios`);
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
        console.error("Error en fetchServicios:", error);
        throw new Error(`No se pudo obtener servicios: ${error.message}`);
    }
};

//FETCHCOLORES
export const fetchColores = async () => {
    const res = await fetch('/TraMag/GetColores');
    if (!res.ok) {
        // Error HTTP explícito
        console.log("error::::", res)
        throw new Error(`Error HTTP ${res.status} al obtener colores`);
    }
    const data = await res.json();
    const dataParse = JSON.parse(data.response)
    if (!data.response) {
        throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
    }
    return dataParse.map(c => ({
        label: c.ColNom,
        value: c.ColCod
    }));
};

//FETCHQFS
export const fetchQFs = async () => {
    const res = await fetch('/TraMag/GetQFS');
    if (!res.ok) {
        // Error HTTP explícito
        throw new Error(`Error HTTP ${res.status} al obtener QFs`);
    }

    const data = await res.json();
    const dataParse = JSON.parse(data.response)
    if (!data.response) {
        throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
    }
    return dataParse.map(q => ({
        label: q.Nombre,
        value: q.Usuario
    }));
};

//FETCH TIPOS DE PREPARACION
export const fetchTiposPreparacion = async () => {
    const res = await fetch('/TraMag/GetTipoPreparacion');
    if (!res.ok) {
        // Error HTTP explícito
        throw new Error(`Error HTTP ${res.status} al obtener tipos de preparación`);
    }
    const data = await res.json();
    const dataParse = JSON.parse(data.response)
    if (!data.response) {
        throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
    }
    return dataParse.map(t => ({
        label: t.Nombre,
        value: t.Codigo
    }));
};

//FETCH ESTADOS
export const fetchEstados = async (modCod) => {
    if (!modCod) {
        throw new Error('Falta  codigo del modulo');
    }
    const params = new URLSearchParams({ modCod }).toString();
    try {
        const res = await fetch(`/TraMag/GetEstados?${params}`);
        if (!res.ok) {
            // Error HTTP explícito
            throw new Error(`Error HTTP ${res.status} al obtener estados del modulo ${modCod}`);
        }
        const data = await res.json();
        const dataParse = JSON.parse(data.response)
        if (!data.response) {
            throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
        }
        return dataParse.map(e => ({
            label: e.EstNom,
            value: e.EstCod
        }));
    } catch {
        console.error("Error en fetchEstados:", error);
        throw new Error(`No se pudo obtener estados: ${error.message}`);
    }
};

//FETCH MOTIVOS  
export const fetchMotDev = async () => {
    const res = await fetch('/TraMag/GetMotDev');
    if (!res.ok) {
        // Error HTTP explícito
        throw new Error(`Error HTTP ${res.status} al obtener motivos de devolucion`);
    }
    const data = await res.json();
    const dataParse = JSON.parse(data.response)
    if (!data.response) {
        throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
    }
    return dataParse.map(m => ({
        label: m.DevDesc,
        value: m.DevCod
    }));
};