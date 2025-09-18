# Trazabilidad Magistral

- **Frontend**: React (PrimeReact) + Vite (JavaScript) — `/tramag.client`
- **Backend**: ASP.NET Core 8 (Web API) — `/tramag.Server Después se conecta a WsTraza`
- **Node.js** v18+ y npm


## Estructura principal
 
   ├─ tramag.client/         # React + Vite
   │  ├─ src/
   |  |  ├─ assets/          #Imágenes e iconos
   │  │  ├─ components/      # Modales y UI por módulo
   │  │  ├─ modules/         # Páginas: Home, Solicitudes, Producción, etc.
   │  │  ├─ services/        # Llamadas a API por dominio
   │  │  ├─ context/         # UserContext (sesión/usuario)
   |  |  ├─ styles/          # CSS  
   │  │  └─ utils/           # helpers (Swal, impresión PDF)
   │  └─ package.json
   └─ tramag.Server/         # ASP.NET Core Web API
      ├─ Controllers/        # Endpoints por etapa
      ├─ Models/             # DTOs de entrada/salida
      ├─ Class/              # Auxiliar, Servicios (HTTP client, URLs, session)
      ├─ Program.cs          # Registro de servicios / Serilog


## Server

## Alistamiento

Base: `/Alistamiento`

### POST /Alistamiento

- Acción: `InsertTraMagAli`
- Parámetros: `[FromBody] Alistamiento payload`
- Respuesta: `{ status, message, response }`

### GET /Alistamiento

- Acción: `GetTraMagAliLog`
- Parámetros: `string prepcod`
- Respuesta: `{ status, message, response }`

### POST /Alistamiento

- Acción: `CancelTraMagAli`
- Parámetros: `[FromBody] CancelarAlistamiento payload`
- Respuesta: `{ status, message, response }`


## Produccion

Base: `/Produccion`

### GET /Produccion

- Acción: `GetOrdenes`
- Parámetros: `string empresa, string sede, string servicio`
- Respuesta: `{ status, message, response }`

### GET /Produccion

- Acción: `GetTraMag1`
- Parámetros: `string empresa, string sede, string csc`
- Respuesta: `{ status, message, response }`

### POST /Produccion

- Acción: `InsertTraMagPro`
- Parámetros: `[FromBody] InsertarProduccion payload`
- Respuesta: `{ status, message, response }`

### POST /Produccion

- Acción: `UpdateTraMagPro`
- Parámetros: `[FromBody] InsertarProduccion payload`
- Respuesta: `{ status, message, response }`

### POST /Produccion

- Acción: `CancelTraMagPro`
- Parámetros: `[FromBody] CancelarProduccion payload`
- Respuesta: `{ status, message, response }`

### POST /Produccion

- Acción: `GetTraMag1Eti`
- Parámetros: `[FromBody] List<InfoEtiqueta> payload`
- Respuesta: `{ status, message, response }`

### POST /Produccion

- Acción: `GetPdfEti`
- Parámetros: `[FromBody] List<InfoEtiquetaPdf> payload`
- Respuesta: `{ status, message, response }`


## Reportes

Base: `/Reportes`

### GET /Reportes

- Acción: `GetOrdDeProd1`
- Parámetros: `string empresa, string sede, string servicio, string fecha`
- Respuesta: `{ status, message, response }`

### GET /Reportes

- Acción: `GetOrdDeProdExt1`
- Parámetros: `string empresa, string sede, string servicio, string fecha`
- Respuesta: `{ status, message, response }`

### GET /Reportes

- Acción: `GetInfoReporteOrdProd`
- Parámetros: `string empresa, string sede, string servicio, string codapli, string fecha, string tipoOrden`
- Respuesta: `{ status, message, response }`

### POST /Reportes

- Acción: `GetPdfOrdDeProd1`
- Parámetros: `[FromBody] List<InfoRepOrdDeProd> payload`
- Respuesta: `{ status, message, response }`


## Revision

Base: `/Revision`

### GET /Revision

- Acción: `GetTraMagRev`
- Parámetros: `string empresa, string sede, string servicio`
- Respuesta: `{ status, message, response }`


## Solicitudes

Base: `/Solicitudes`

### POST /Solicitudes

- Acción: `InsertTraMagSolExt`
- Parámetros: `[FromBody] InsertSolicitudExt payload`
- Respuesta: `{ status, message, response }`

### GET /Solicitudes

- Acción: `GetOrdenesExt`
- Parámetros: `string empresa, string sede, string servicio`
- Respuesta: `{ status, message, response }`

### POST /Solicitudes

- Acción: `CancelSolicitudesExt`
- Parámetros: `[FromBody] CancelarSolicitudes payload`
- Respuesta: `{ status, message, response }`


## TraMag

Base: `/TraMag`

### GET /TraMag

- Acción: `GetToken`
- Parámetros: `—`
- Respuesta: `{ status, message, response }`

### GET /TraMag

- Acción: `GetMezclas`
- Parámetros: `—`
- Respuesta: `{ status, message, response }`

### GET /TraMag

- Acción: `GetProductos`
- Parámetros: `—`
- Respuesta: `{ status, message, response }`

### GET /TraMag

- Acción: `GetEmpresas`
- Parámetros: `—`
- Respuesta: `{ status, message, response }`

### GET /TraMag

- Acción: `GetSedes`
- Parámetros: `[FromQuery] string empresa`
- Respuesta: `{ status, message, response }`

### GET /TraMag

- Acción: `GetServicios`
- Parámetros: `[FromQuery] string empresa, [FromQuery] string sede`
- Respuesta: `{ status, message, response }`

### GET /TraMag

- Acción: `GetServiciosExt`
- Parámetros: `[FromQuery] string empresa, [FromQuery] string sede`
- Respuesta: `{ status, message, response }`

### GET /TraMag

- Acción: `GetColores`
- Parámetros: `—`
- Respuesta: `{ status, message, response }`

### GET /TraMag

- Acción: `GetQFS`
- Parámetros: `—`
- Respuesta: `{ status, message, response }`

### GET /TraMag

- Acción: `GetTipoPreparacion`
- Parámetros: `—`
- Respuesta: `{ status, message, response }`

### GET /TraMag

- Acción: `GetEstados`
- Parámetros: `[FromQuery] string modCod`
- Respuesta: `{ status, message, response }`

### GET /TraMag

- Acción: `GetMotDev`
- Parámetros: `—`
- Respuesta: `{ status, message, response }`


## User

Base: `/User`

### GET /User

- Acción: `GetUsuario`
- Parámetros: `string usuario, string empresa, string sede`
- Respuesta: `{ status, message, response }`

### GET /User

- Acción: `GetMenu`
- Parámetros: `string usuario, string sede`
- Respuesta: `{ status, message, response }`

### GET /User

- Acción: `GetIcono`
- Parámetros: `string aplicacion, string nombre`
- Respuesta: `{ status, message, response }`


