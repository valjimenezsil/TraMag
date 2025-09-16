
//OBTENER ORDEN DE PRODUCCION POR EMPRESA, SEDE, SERVICIO Y FECHA
export const fetchOrdDeProd = async (empresa, sede, servicio, fecha1) => {
    if (!empresa || !sede || !servicio || !fecha1) {
        throw new Error('fetchOrdDeProdExt: falta empresa, sede, servicio o fecha');
    }
    const fecha = fecha1.toISOString().split("T")[0];
    const params = new URLSearchParams({ empresa, sede, servicio, fecha }).toString();
    try {
        const response = await fetch(`/Reportes/GetOrdDeProd1?${params}`);
        if (!response.ok) {
            console.log("error", response)
            // Error HTTP expl�cito
            throw new Error(`Error HTTP ${response.status} al obtener �rdenes de producci�n `);
        }
        console.log("response", response)

        const data = await response.json();
        const dataParse = JSON.parse(data.response)
        if (!data.response) {
            throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
        }
        return dataParse;

    } catch (error) {
        console.error("Error en fetchOrdDeProdExt:", error);
        throw new Error(`No se pudo obtener Orden de produccion: ${error.message}`);
    }
}

//OBTENER ORDEN DE PRODUCCION POR EMPRESA, SEDE, SERVICIO Y FECHA
export const fetchOrdDeProdExt = async (empresa, sede, servicio, fecha1) => {
    if (!empresa || !sede || !servicio || !fecha1) {
        throw new Error('fetchOrdDeProdExt: falta empresa, sede, servicio o fecha');
    }
    const fecha = fecha1.toISOString().split("T")[0];
    const params = new URLSearchParams({ empresa, sede, servicio, fecha }).toString();
    try {
        const response = await fetch(`/Reportes/GetOrdDeProdExt1?${params}`);
        if (!response.ok) {
            console.log("error", response)
            // Error HTTP expl�cito
            throw new Error(`Error HTTP ${response.status} al obtener �rdenes de producci�n ext `);
        }

        const data = await response.json();
        const dataParse = JSON.parse(data.response)
        if (!data.response) {
            throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
        }
        return dataParse;

    } catch (error) {
        console.error("Error en fetchOrdDeProdExt:", error);
        throw new Error(`No se pudo obtener Orden de produccion ext: ${error.message}`);
    }
}

//OBTENER REPORTE DE PRODUCCION POR EMPRESA, SEDE, SERVICIO Y FECHA
export const fetchReporteOrdDeProd = async (user, empresa, sede, servicio, fecha1,tipoOrden) => {
    if (!empresa || !sede || !servicio || !user) {
        throw new Error('fetchReporteOrdDeProd: falta empresa, sede, servicio o usuario');
    }
    const codapli = user.codapli;
    const fecha = fecha1.toISOString().split("T")[0];
    const params = new URLSearchParams({ empresa, sede, servicio, codapli ,fecha,tipoOrden}).toString();
    try {
        const response = await fetch(`/Reportes/GetInfoReporteOrdProd?${params}`);
        if (!response.ok) {
            console.log("error", response)
            // Error HTTP expl�cito
            throw new Error(`Error HTTP ${response.status} al obtener reporte de �rdenes de producci�n `);
        }
        const data = await response.json();
        const data1 = JSON.parse(data.response);
        const dataParse = data1.map(item => ({ ...item, fecha }));

        if (!data.response) {
            throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
        }
        return dataParse;
    } catch (error) {
        console.error("Error en fetchReporteOrdDeProd:", error);
        throw new Error(`No se pudo obtener reporte de Orden de produccion: ${error.message}`);
    }
}
