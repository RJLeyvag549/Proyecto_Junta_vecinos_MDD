import Swal from 'sweetalert2';

export function showSuccess(title, text) {
  Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    background: '#e6f4ea', // verde pastel
    color: '#003366', // azul marino para el texto
    confirmButtonColor: '#003366',
    showCloseButton: true,
    customClass: {
      popup: 'popup-class',
    },
  });
}

export function showError(title, text) {
  Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    background: '#fcebea',
    color: '#721c24',
    confirmButtonColor: '#721c24',
    showCloseButton: true,
    customClass: {
      popup: 'popup-class',
    },
  });
}
