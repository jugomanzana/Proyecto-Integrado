import React from 'react';
import { LoginForm } from '../components/organisms/LoginForm';

// ============================================================
// PÁGINA: LoginView
// Nivel "Page" del Atomic Design.
// Solo provee el layout de pantalla completa centrado.
// Toda la lógica de UI vive en el organismo LoginForm.
// ============================================================

export const LoginView: React.FC = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-warm-cream p-4">
      <LoginForm />
    </main>
  );
};

