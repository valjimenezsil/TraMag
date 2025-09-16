import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import { UserProvider } from './context/UserContext';


// PrimeReact styles
import 'primereact/resources/themes/viva-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './styles/colors.css';


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <UserProvider>
            <App />
        </UserProvider>
    </BrowserRouter>
);
