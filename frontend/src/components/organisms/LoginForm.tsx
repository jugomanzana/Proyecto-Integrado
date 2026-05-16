import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../viewmodels/useAuth';
import { Button }      from '../atoms/Button';
import { Divider }     from '../atoms/Divider';
import { NavBrand }    from '../molecules/NavBrand';
import { FormField }   from '../molecules/FormField';
import { AlertBanner } from '../molecules/AlertBanner';

// ============================================================
// ORGANISMO: LoginForm
// Formulario completo de autenticación: login + registro.
// Contiene toda la lógica de UI del flujo auth.
// La lógica de negocio permanece en el viewmodel useAuth.
// ============================================================

export const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin]       = useState(true);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [username, setUsername]     = useState('');

  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const ok = await login(email, password);
      if (ok) navigate('/dashboard');
    } else {
      const ok = await register(username, email, password);
      if (ok) {
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setUsername('');
      }
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-warm-beige w-full max-w-md"
    >
      {/* Cabecera de marca */}
      <div className="flex flex-col items-center mb-8 gap-4">
        <NavBrand size="lg" />
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-warm-dark leading-tight">
            {isLogin ? 'Bienvenido de vuelta' : 'Únete a MyWardrobe'}
          </h1>
          <p className="text-sm text-warm-brown/70 mt-1">
            {isLogin
              ? 'Accede a tu armario digital'
              : 'Crea tu cuenta y organiza tu estilo'}
          </p>
        </div>
      </div>

      {/* Banner de error */}
      {error && (
        <div className="mb-5">
          <AlertBanner variant="error" message={error} />
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Campo username — solo en registro */}
        <AnimatePresence initial={false}>
          {!isLogin && (
            <motion.div
              key="username"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <FormField
                id="username"
                label="Nombre de usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="StyleGuru99"
                icon={<User size={16} />}
                required={!isLogin}
                autoComplete="username"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          icon={<Mail size={16} />}
          required
          autoComplete="email"
        />

        <FormField
          id="password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={<Lock size={16} />}
          required
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          helper={!isLogin ? 'Mínimo 8 caracteres' : undefined}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          loading={loading}
          className="mt-2"
        >
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </Button>
      </form>

      <Divider className="my-6" />

      {/* Toggle login ↔ registro */}
      <p className="text-center text-sm text-warm-brown">
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
        <button
          type="button"
          onClick={toggleMode}
          className="font-semibold text-warm-accent hover:text-warm-accent-dark transition-colors underline-offset-2 hover:underline"
        >
          {isLogin ? 'Regístrate' : 'Inicia sesión'}
        </button>
      </p>
    </motion.div>
  );
};
