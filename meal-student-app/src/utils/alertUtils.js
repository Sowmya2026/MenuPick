import Swal from 'sweetalert2';

// Get current theme from localStorage
const getCurrentTheme = () => {
  const savedTheme = localStorage.getItem('menuPickTheme') || 'espresso';

  const themes = {
    espresso: {
      primary: '#8b6f47',
      background: '#f5f1ed',
      text: '#2d2520',
    },
    cream: {
      primary: '#d4a574',
      background: '#faf8f5',
      text: '#3d3530',
    },
    champagne: {
      primary: '#c9a961',
      background: '#faf7f0',
      text: '#3d3530',
    },
    slate: {
      primary: '#708090',
      background: '#f5f6f7',
      text: '#2d3748',
    },
    navy: {
      primary: '#1e3a5f',
      background: '#f0f4f8',
      text: '#1a202c',
    },
    emerald: {
      primary: '#2d5f4f',
      background: '#f0f5f3',
      text: '#1a3a2e',
    },
  };

  return themes[savedTheme] || themes.espresso;
};

export const showAlert = (title, message, type = 'error') => {
  const theme = getCurrentTheme();

  // Icon colors - success uses theme color, others use standard colors
  const iconColors = {
    success: theme.primary, // Use theme color for success!
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };

  return Swal.fire({
    title: title,
    text: message,
    icon: type,
    confirmButtonText: 'OK',
    allowOutsideClick: true,
    allowEscapeKey: true,
    showClass: {
      popup: 'animate__animated animate__fadeInDown animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp animate__faster'
    },
    customClass: {
      popup: 'rounded-3xl shadow-2xl border-2',
      title: 'text-xl sm:text-2xl font-bold',
      htmlContainer: 'text-sm sm:text-base',
      confirmButton: 'rounded-xl font-semibold py-3 px-6 text-white shadow-lg hover:shadow-xl transition-all',
      icon: 'border-4'
    },
    background: theme.background,
    color: theme.text,
    iconColor: iconColors[type] || theme.primary,
    confirmButtonColor: theme.primary,
    buttonsStyling: true,
    backdrop: `
      rgba(0,0,0,0.4)
      left top
      no-repeat
    `
  });
};

export const showSuccess = (title, message) => showAlert(title, message, 'success');
export const showError = (title, message) => showAlert(title, message, 'error');
export const showWarning = (title, message) => showAlert(title, message, 'warning');
export const showInfo = (title, message) => showAlert(title, message, 'info');

// Custom themed toast notification
export const showToast = (message, type = 'success') => {
  const theme = getCurrentTheme();

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: 'rounded-2xl shadow-lg',
      title: 'text-sm font-semibold'
    },
    background: theme.background,
    color: theme.text,
    iconColor: type === 'success' ? theme.primary : type === 'error' ? '#ef4444' : theme.primary,
  });

  Toast.fire({
    icon: type,
    title: message
  });
};

// Custom themed logout confirmation
export const showLogoutConfirmation = () => {
  const theme = getCurrentTheme();

  return Swal.fire({
    title: 'Sign Out?',
    text: 'Are you sure you want to sign out?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Sign Out',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    allowOutsideClick: true,
    showClass: {
      popup: 'animate__animated animate__fadeInDown animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp animate__faster'
    },
    customClass: {
      popup: 'rounded-3xl shadow-2xl border-2',
      title: 'text-xl sm:text-2xl font-bold',
      htmlContainer: 'text-sm sm:text-base',
      confirmButton: 'rounded-xl font-semibold py-3 px-6 text-white shadow-lg hover:shadow-xl transition-all',
      cancelButton: 'rounded-xl font-semibold py-3 px-6 shadow-lg hover:shadow-xl transition-all',
      actions: 'gap-3'
    },
    background: theme.background,
    color: theme.text,
    iconColor: theme.primary,
    confirmButtonColor: '#ef4444', // Red for logout
    cancelButtonColor: theme.primary,
    buttonsStyling: true,
  });
};