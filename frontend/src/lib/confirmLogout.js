import Swal from 'sweetalert2';

export async function confirmLogout() {
  const result = await Swal.fire({
    title: '¿Cerrar sesión?',
    text: 'Vas a tener que volver a ingresar tus datos para acceder de nuevo.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Cerrar sesión',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#D32027',
    background: '#0D0D0D',
    color: '#FFFFFF',
  });
  return result.isConfirmed;
}
