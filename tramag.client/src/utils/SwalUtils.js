import Swal from 'sweetalert2';


//Funcion del SwalLoading
export const withSwalLoading = (message) => {
    Swal.fire({
        title: message,
        allowOutsideClick: false,
        returnFocus: false, 
        didOpen: () => {
            Swal.getPopup().parentElement.style.zIndex = '9999';
        }
    });
    Swal.showLoading()
}

//Funcion del swalMensaje
export const swalMensaje = (icon, text) => {
    Swal.fire({
        icon: icon,
        title: 'Mensaje del sistema',
        showConfirmButton: true,
        text: text,
        returnFocus: false, 
        didOpen: () => {
            const swalEl = document.querySelector('.swal2-container');
            if (swalEl) swalEl.style.zIndex = '9999';
        },
    });
}

//Funcion del swalMissing
export const swalMissing = (labels, primer) => {

    Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: `Falta: ${labels}`,
        confirmButtonText: 'OK',
        scrollbarPadding: false,
        returnFocus: false, 
        didOpen: () => {
            const swalEl = document.querySelector('.swal2-container');
            if (swalEl) swalEl.style.zIndex = '9999';
        },
        customClass: {
            confirmButton: 'swal-confirmar',
            cancelButton: 'swal-cancelar'
        },
        didClose: () => primer.ref.current?.focus()
    });
}



