import Swal from 'sweetalert2';

export const useAlert = () => {
  const success = (message: string, title = 'Success!') => {
    return Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonColor: '#db2777',
      confirmButtonText: 'OK',
    });
  };

  const error = (message: string, title = 'Error!') => {
    return Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'OK',
    });
  };

  const warning = (message: string, title = 'Warning!') => {
    return Swal.fire({
      icon: 'warning',
      title,
      text: message,
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'OK',
    });
  };

  const info = (message: string, title = 'Info') => {
    return Swal.fire({
      icon: 'info',
      title,
      text: message,
      confirmButtonColor: '#0ea5e9',
      confirmButtonText: 'OK',
    });
  };

  const confirm = (message: string, title = 'Are you sure?') => {
    return Swal.fire({
      icon: 'question',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonColor: '#db2777',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
  };

  return {
    success,
    error,
    warning,
    info,
    confirm,
  };
};
