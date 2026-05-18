import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../viewmodels/useAuth';
import { Navbar } from '../components/organisms/Navbar';
import { FormField } from '../components/molecules/FormField';
import { Button } from '../components/atoms/Button';
import { AlertBanner } from '../components/molecules/AlertBanner';
import { Avatar } from '../components/atoms/Avatar';
import { ConfirmationModal } from '../components/molecules';

// ============================================================
// VISTA: ProfileView
// Permite al usuario ver estadísticas de su cuenta,
// actualizar su foto de perfil y sus datos personales (nombre,
// apellidos, fecha de nacimiento, usuario y correo), cambiar
// su contraseña mediante un modal premium y eliminar su cuenta.
// ============================================================

export const ProfileView: React.FC = () => {
  const { user, updateProfile, updatePassword, fetchUserStats, deleteAccount, error: authError } = useAuth();
  const [stats, setStats] = useState<{ totalItems: number; totalOutfits: number; mostUsedItemName?: string } | null>(null);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [localError, setLocalError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  useEffect(() => {
    if (user) {
      setUsername(prev => prev || user.username);
      setEmail(prev => prev || user.email);
      setFirstName(prev => prev || user.firstName || '');
      setLastName(prev => prev || user.lastName || '');
      setBirthDate(prev => prev || user.birthDate || '');
      if (!avatarFile) {
        setAvatarPreview(user.avatarUrl || '');
      }
    }
  }, [user, avatarFile]);

  useEffect(() => {
    fetchUserStats().then(data => {
      if (data) setStats(data);
    });

    // Restaurar el usuario guardado original en el Navbar si el usuario navega fuera sin guardar
    return () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        window.dispatchEvent(new CustomEvent('auth-user-changed', { detail: JSON.parse(storedUser) }));
      }
    };
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    const success = await updateProfile(
      username,
      email,
      firstName || null,
      lastName || null,
      birthDate || null,
      avatarFile
    );
    if (success) {
      setSuccessMsg('Perfil actualizado correctamente.');
      setAvatarFile(null);
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
      setShowPasswordModal(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    await deleteAccount();
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
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

        <div className="max-w-2xl mx-auto w-full">
          
          {/* Datos Personales */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-warm-beige space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-warm-beige">
              <div className="relative group w-20 h-20 rounded-full cursor-pointer overflow-hidden border-2 border-warm-beige hover:border-warm-accent transition-all duration-200 shadow-sm shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={username} className="w-full h-full object-cover" />
                ) : (
                  <Avatar size="xl" src={null} alt={username || 'A'} className="w-full h-full" />
                )}
                
                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/55 text-white text-xs font-semibold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer select-none">
                  <span>Editar</span>
                </label>
                
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      const objectUrl = URL.createObjectURL(file);
                      setAvatarPreview(objectUrl);
                      if (user) {
                        const tempUser = { ...user, avatarUrl: objectUrl };
                        window.dispatchEvent(new CustomEvent('auth-user-changed', { detail: tempUser }));
                      }
                    }
                  }}
                  className="hidden"
                />
              </div>
              <div className="text-center sm:text-left flex-1 space-y-1">
                <h2 className="text-xl font-semibold text-warm-dark">Datos Personales</h2>
                <p className="text-sm text-warm-brown">Actualiza tu foto e información pública.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* 1. Nombre y Apellidos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="firstName"
                  label="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre"
                />
                <FormField
                  id="lastName"
                  label="Apellidos"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tus apellidos"
                />
              </div>

              {/* 2. Fecha de nacimiento */}
              <FormField
                id="birthDate"
                label="Fecha de nacimiento"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={!!user?.birthDate}
                helper={!!user?.birthDate ? "La fecha de nacimiento no se puede modificar una vez establecida." : undefined}
              />

              {/* 3. Datos de acceso (Nombre de usuario e Email) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary">Guardar datos</Button>
              </div>
            </form>

            {/* Opciones de Seguridad y Cuenta en el pie de la tarjeta */}
            <div className="pt-6 mt-6 border-t border-warm-beige flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <h3 className="text-sm font-semibold text-warm-dark">Seguridad y Cuenta</h3>
                <p className="text-xs text-warm-brown">
                  Gestiona tu contraseña de acceso o elimina tu cuenta de forma definitiva.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 bg-warm-beige/40 text-warm-dark rounded-xl hover:bg-warm-beige/80 font-medium transition-colors text-sm"
                >
                  Cambiar contraseña
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-medium transition-colors text-sm"
                >
                  Eliminar cuenta
                </button>
              </div>
            </div>

          </section>

        </div>
      </main>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="¿Eliminar cuenta permanentemente?"
        message="¿Estás seguro de que deseas eliminar tu cuenta? Se borrarán de forma irreversible todas tus prendas registradas, todos tus outfits y todas las imágenes de tu armario virtual."
        confirmText="Eliminar permanentemente"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Modal interactivo premium para cambiar contraseña */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop con desenfoque suave */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPasswordModal(false);
                setCurrentPassword('');
                setNewPassword('');
              }}
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            />
            
            {/* Contenido del Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
              className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-warm-beige relative z-10 space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-warm-dark">Cambiar contraseña</h3>
                <p className="text-sm text-warm-brown mt-1">
                  Por seguridad, introduce tu contraseña actual y luego define tu nueva contraseña.
                </p>
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
                  helper="Mínimo 6 caracteres"
                />
                
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-warm-beige">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setCurrentPassword('');
                      setNewPassword('');
                    }}
                    className="px-4 py-2 bg-warm-beige/40 text-warm-dark rounded-xl hover:bg-warm-beige/60 font-medium transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <Button type="submit" variant="primary">
                    Guardar contraseña
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
