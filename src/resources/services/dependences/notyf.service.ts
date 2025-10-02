import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class NotyfService {
    private isAlertShown = false;
    private notyf = new Notyf({
        duration: 2000,
        position: { x: 'right', y: 'top' },
        dismissible: true,
    });

    constructor() { }

    success(message: string) {
        this.notyf.success(message);
    }

    error(message: string) {
        if (!this.isAlertShown) {
            this.isAlertShown = true;
            this.notyf.error(message);
            setTimeout(() => {
                this.isAlertShown = false;
            }, 2000);
        }
    }

    swalSuccess(mensaje: string, code: string | null, event: any) {
        Swal.fire({
            title: 'Éxito',
            html: `<span>${mensaje}</span><br/><b>${code}</b>`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3085d6',
            showCancelButton: false,
            preConfirm: () => {
                event();
            }
        });
    }

    swalDeleteConfirm(event: any, title: string = '¿Está seguro de cambiar el estado del registro?') {
        Swal.fire({
            title: title,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            preConfirm: () => {
                event();
            }
        });
    }


    // SWAL CON INPUT COMENTARIO
    swalInputComentario(
        title: string = '¿Está seguro de cambiar el estado del registro?',
        placeholder: string = 'Escribe un comentario...',
        callback: (inputValue: string) => void
    ) {
        Swal.fire({
            title: title,
            input: 'textarea',
            inputPlaceholder: placeholder,
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            inputValidator: (value) => {
                if (!value) {
                    return 'Por favor, escribe un comentario.';
                }
                return null;
            },
            preConfirm: (inputValue) => {
                return inputValue;
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                callback(result.value); // Llama al callback con el valor del input
            }
        });
    }
    

    // INPUT SELECT + TEXTO HTML
    swalInputSelect(
        title: string = '¿Está seguro de cambiar el estado del registro?',
        html: string,
        data: any[],
        callback: (inputValue: string) => void
    ) {
        Swal.fire({
            title: title,
            html: html,
            input: 'select',
            inputOptions: data.reduce((acc, item) => {
                acc[item.value] = item.label;
                return acc;
            }, {}),
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            inputValidator: (value) => {
                if (!value) {
                    return 'Por favor, selecciona una opción.';
                }
                return null;
            },
            preConfirm: (inputValue) => {
                return inputValue;
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                callback(result.value); // Llama al callback con el valor del input
            }
        });
    }

}
