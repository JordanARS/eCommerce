'use client';

import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.setItem('auth-state-changed', String(Date.now()));
      window.dispatchEvent(new Event('auth-state-changed-local'));
      router.push('/admin/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-colors text-red-300 mt-auto"
    >
      Cerrar Sesión
    </button>
  );
}
