import React, { useState, useEffect } from 'react';
import { useAuth } from '../viewmodels/useAuth';
import { Navbar } from '../components/organisms/Navbar';
import { FormField } from '../components/molecules/FormField';
import { Button } from '../components/atoms/Button';
import { AlertBanner } from '../components/molecules/AlertBanner';
import { Avatar } from '../components/atoms/Avatar';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, updatePassword, fetchUserStats, deleteAccount, error: authError } = useAuth();
  
  const [stats, setStats] = useState<{ totalItems: number; totalOutfits: number; mostUsedItemName?: string } | null>(null);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
    fetchUserStats().then(data => {
      if (data) setStats(data);
    });
  }, [user, fetchUserStats]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    const success = await updateProfile(username, email);
    if (success) {
      setSuccessMsg('Perfil actualizado correctamente.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    
    if (newPassword.length < 6) {
      setLocalError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const success = await updatePassword(currentPassword, newPassword);
    if (success) {
      setSuccessMsg('Contraseña actualizada correctamente.');
      setCurrentPassword('');
      setNewPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar tu cuenta permanentemente? Se borrarán todas tus prendas, outfits y fotos. Esta acción no se puede deshacer.'
    );
    if (isConfirmed) {
      await deleteAccount();
    }
  };

  const error = localError || authError;

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold text-warm-dark leading-tight">Tu Perfil</h1>
          <p className="text-warm-brown mt-1">Gestiona tus datos personales y seguridad.</p>
        </header>

        {error && <AlertBanner variant="error" message={error} />}
        {successMsg && <AlertBanner variant="success" message={successMsg} />}

        {/* Panel de Estadísticas */}
        {stats && (
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-beige flex flex-col items-center justify-center text-center">
              <p className="text-3xl font-bold text-warm-dark">{stats.totalItems}</p>
              <p className="text-sm font-semibold tracking-wide text-warm-brown uppercase">Prendas registradas</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-beige flex flex-col items-center justify-center text-center">
              <p className="text-3xl font-bold text-warm-dark">{stats.totalOutfits}</p>
              <p className="text-sm font-semibold tracking-wide text-warm-brown uppercase">Outfits creados</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-beige flex flex-col items-center justify-center text-center">
              <p className="text-xl font-bold text-warm-dark break-words line-clamp-2 max-w-full">{stats.mostUsedItemName || 'Ninguna todavía'}</p>
              <p className="text-sm font-semibold tracking-wide text-warm-brown uppercase mt-1">Prenda más usada</p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Datos Personales */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-warm-beige space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <Avatar size="lg" alt="Avatar de perfil" />
              <div>
                <h2 className="text-xl font-semibold text-warm-dark">Datos Personales</h2>
                <p className="text-sm text-warm-brown">Actualiza tu información pública.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <FormField
                id="username"
                label="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <FormField
                id="email"
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="pt-2">
                <Button type="submit" variant="primary">Guardar datos</Button>
              </div>
            </form>
          </section>

          {/* Seguridad */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-warm-beige space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-warm-dark">Seguridad</h2>
              <p className="text-sm text-warm-brown mt-1">Cambia tu contraseña de acceso.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FormField
                id="currentPassword"
                label="Contraseña actual"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <FormField
                id="newPassword"
                label="Nueva contraseña"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div className="pt-2">
                <Button type="submit" variant="secondary">Cambiar contraseña</Button>
              </div>
            </form>

            <div className="pt-6 mt-6 border-t border-warm-beige">
              <h3 className="text-sm font-semibold text-red-600 mb-2">Zona Peligrosa</h3>
              <p className="text-xs text-warm-brown mb-4">
                Eliminar tu cuenta borrará permanentemente todos tus datos y fotos. Esta acción no se puede deshacer.
              </p>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-medium transition-colors text-sm"
              >
                Eliminar cuenta permanentemente
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};
