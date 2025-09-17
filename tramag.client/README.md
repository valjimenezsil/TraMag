# Trazabilidad Magistral

- **Frontend**: React + Vite (JavaScript) — `/tramag.client`
- **Backend**: ASP.NET Core 8 (Web API) — `/tramag.Server Después se conecta a WsTraza`
- **Node.js** v18+ y npm


## Estructura principal
 
   ├─ tramag.client/         # React + Vite
   │  ├─ src/
   │  │  ├─ components/      # Modales y UI por módulo
   │  │  ├─ modules/         # Páginas: Home, Solicitudes, Producción, etc.
   │  │  ├─ services/        # Llamadas a API por dominio
   │  │  ├─ context/         # UserContext (sesión/usuario)
   │  │  └─ utils/           # helpers (Swal, impresión PDF)
   │  └─ package.json
   └─ tramag.Server/         # ASP.NET Core Web API
      ├─ Controllers/        # Endpoints por etapa
      ├─ Models/             # DTOs de entrada/salida
      ├─ Class/              # Auxiliar, Servicios (HTTP client, URLs, session)
      ├─ Program.cs          # Registro de servicios / Serilog
      └─ appsettings.json