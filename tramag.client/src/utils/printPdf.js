export async function openPdf(endpointUrl, body, printWindow) {
    const win = printWindow ?? window.open('', '_blank');

    try {
        win.document.open();
        win.document.write(`
      <html><head><title>Cargando PDF...</title></head>
      <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif">
        <div>Cargando PDF...</div>
      </body></html>
    `);
        win.document.close();
    } catch (e) {
        if (!printWindow && win) win.close();
        throw new Error('No se pudo abrir la ventana.');
    }

    try {
        const resp = await fetch(endpointUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        console.log("resp del printpdf", resp)

        if (!resp.ok) throw new Error(`HTTP ${resp.status} al generar el pdf`);

        const blob = await resp.blob(); // application/pdf
        const blobUrl = URL.createObjectURL(blob);

        // Inyectar solo el iframe con el PDF, sin print
        win.document.open();
        win.document.write(`
      <html>
        <head><title>Vista PDF</title></head>
        <body style="margin:0">
          <iframe src="${blobUrl}" style="border:0;width:100vw;height:100vh"></iframe>
        </body>
      </html>
    `);
        win.document.close();

        const timer = setInterval(() => {
            if (win.closed) {
                clearInterval(timer);
                URL.revokeObjectURL(blobUrl);
            }
        }, 1000);
    } catch (err) {
        if (win && !win.closed) win.close();
        throw err;
    }
}