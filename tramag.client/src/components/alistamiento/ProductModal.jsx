// ProductModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { fetchProductosData } from '../../services/maestrosService';
import { withSwalLoading, swalMensaje } from '../../utils/SwalUtils';
import Swal from 'sweetalert2';


export default function ProductModal({
    visible,
    onHide,
    onSelect,
    onAfterSelect,
}) {
    const [items, setItems] = useState([]);         
    const dropdownRef = useRef(null);

    // Cada vez que se abra el modal, cargo productos
    useEffect(() => {
        if (!visible) return;

        const load = async () => {
            withSwalLoading('Cargando informaci\u00F3n')
            try {       
                const response = await fetchProductosData();
                setItems(response);
                Swal.close()
            } catch (err) {
                swalMensaje('warning', err.message)
                console.error('Error cargando productos en modal:', err);
            } 
        };
        load();
    }, [visible]);

 
    const handleChange = e => {
        const codigo = e.value; // viene el Codigo porque usamos optionValue="Codigo"
        const selected = items.find(x => x.Codigo === codigo);
        if (selected) onSelect(selected);
        onHide();
    };

    return (
        <Dialog
            header="Seleccione producto"
            visible={visible}
            style={{ width: '60vw', height: '30vw' }}
            modal
            onHide={() => {
                onHide();
                onAfterSelect?.();
            }}
            draggable={false}
        >

            <Dropdown
                ref={dropdownRef}
                options={items}
                optionLabel="Nombre"
                optionValue="Codigo"
                placeholder="Seleccione..."
                onChange={handleChange}
                style={{ width: '100%' }}
                filter
                filterBy="Nombre,Codigo,RegInvima"
                appendTo="self"
                virtualScrollerOptions={{
                    itemSize: 40,               
                    delay: 0                    
                }}
            />

        </Dialog>
    );
}
