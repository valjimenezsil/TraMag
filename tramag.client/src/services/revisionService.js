export const fetchOrdenesRev = async (empresa, sede, servicio) => {

    const params = new URLSearchParams({ empresa, sede, servicio }).toString();

    try {
        const res = await fetch(`/Revision/GetTraMagRev?${params}`)
        if (!res.ok) {
            // Error HTTP expl�cito
            throw new Error(`Error HTTP ${res.status} al obtener �rdenes para revisar`);
        }
        const data = await res.json();
        const dataParse = JSON.parse(data.response)
        console.log("Ordenes de Rev", dataParse)
        if (!data.response) {
            throw new Error(`Respuesta inesperada del servidor: ${JSON.stringify(data)}`);
        }
        return dataParse;
    } catch (error) {
        console.error("Error en fetchOrdenesRev:", error);
        throw new Error(`No se pudo obtener Ordenes para revisar: ${error.message}`);
    }
};