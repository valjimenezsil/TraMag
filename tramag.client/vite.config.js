import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "tramag.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7043';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false
            },
            '^/User/GetUsuario': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/User/GetMenu': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/User/GetIcono': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            //Maestros
            '^/TraMag/GetMezclas': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/TraMag/GetEmpresas': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/TraMag/GetProductos': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/TraMag/GetSedes': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/TraMag/GetServicios': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/TraMag/GetServiciosExt': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/TraMag/GetColores': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/TraMag/GetQFS': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/TraMag/GetTipoPreparacion': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/TraMag/GetEstados': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/TraMag/GetMotDev': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            // Producción
            '^/Produccion/GetOrdenes': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Produccion/GetTraMag1': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Produccion/InsertTraMagPro': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Produccion/UpdateTraMagPro': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Produccion/CancelTraMagPro': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Produccion/GetTraMag1Eti': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Produccion/GetPdfEti': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            // Solicitudes Externas
            '^/Solicitudes/InsertTraMagSolExt': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Solicitudes/GetOrdenesExt': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Solicitudes/CancelSolicitudesExt': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            //Reportes
            '^/Reportes/GetOrdDeProd1': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Reportes/GetOrdDeProdExt1': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Reportes/GetInfoReporteOrdProd': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Reportes/GetPdfOrdDeProd1': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            //Alistamiento
            '^/Alistamiento/InsertTraMagAli': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Alistamiento/GetTraMagAliLog': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            '^/Alistamiento/CancelTraMagAli': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
            //Revision
            '^/Revision/GetTraMagRev': {
                target,
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            },
        },
        port: parseInt(env.DEV_SERVER_PORT || '64257'),
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
