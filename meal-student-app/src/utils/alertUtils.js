// utils/alertUtils.js
import Swal from 'sweetalert2';

export const showAlert = (title, message, type = 'error') => {
  return Swal.fire({
    title: title,
    text: message,
    icon: type,
    confirmButtonText: 'OK',
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      popup: 'rounded-2xl border-4 border-white shadow-2xl',
      confirmButton: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-2xl'
    }
  });
};

export const showSuccess = (title, message) => showAlert(title, message, 'success');
export const showError = (title, message) => showAlert(title, message, 'error');
export const showWarning = (title, message) => showAlert(title, message, 'warning');
export const showInfo = (title, message) => showAlert(title, message, 'info');