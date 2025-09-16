//Prueba
const API_URL = "https://localhost:7246";
//Produccion
//const API_URL = "https://wsuta.ocgnlocal.co";
export async function apiFetch(path, options = {}, params = {}) {
    let url = `${API_URL}/${path}`;
    const qs = new URLSearchParams(params).toString();
    if (qs) url += `?${qs}`;
    let response;
    try {
        response = await fetch(url, options);
    } catch (networkErr) {
        if (!navigator.onLine) {
            throw new Error('No hay conexión a Internet. Verifica tu red e inténtalo de nuevo.');
        } else {
            throw new Error('No se pudo conectar con el servidor. Por favor intenta m\u00E1s tarde.');
        }
    }
    const text = await response.text();
    console.log("text",text)
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    console.log("data", data)
    if (!response.ok) {
        const errorsObj = data.errors || {};
        const mensajes = Object
            .values(errorsObj)        
            .flat()                   
            .join('\n');     
        const mensajeFinal = mensajes ||
            (typeof data === 'string' ? data : response.statusText);
        throw new Error(mensajeFinal);    }
    return data;
}