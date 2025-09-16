import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Entrada from './modules/Entrada.jsx';
import Solicitudes from './modules/Solicitudes.jsx';
import Produccion from './modules/Produccion.jsx'
import Revision from './modules/Revision.jsx'
import Preparacion from './modules/Preparacion.jsx'
import PreparacionA from './modules/PreparacionA.jsx'
import Home from './modules/Home.jsx'
import Reportes from './modules/Reportes.jsx'
import './App.css';

function App() {
      
    return (
        <Layout>
            <Routes>
                {/* Ruta explícita para /entrada */}
                <Route path="/" element={<Home />} />
                <Route path="/entrada" element={<Entrada />} />
                <Route path="/solicitudes" element={<Solicitudes />} />
                <Route path="/produccion" element={<Produccion /> } />
                <Route path="/revision" element={<Revision /> } />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/preparacion" element={<Preparacion/> }/>
                <Route path="/preparacionA" element={<PreparacionA /> }/>

                {/*Default */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
}


export default App;