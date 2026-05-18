import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth }    from '../../viewmodels/useAuth';
import { Button }     from '../atoms/Button';
import { NavBrand }   from '../molecules/NavBrand';
import { UserInfo }   from '../molecules/UserInfo';

// ============================================================
// ORGANISMO: Navbar
// Barra de navegación principal de la app autenticada.
// Incluye: marca, info de usuario, logout y menú móvil.
// ============================================================

interface NavItem {
  label: string;
  href:  string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Armario',  href: '/dashboard'  },
  { label: 'Outfits',  href: '/outfits'    },
  { label: 'Añadir',   href: '/items/new'  },
];

export const Navbar: React.FC = () => {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-warm-beige">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Marca */}
        <button
          onClick={() => navigate('/dashboard')}
          className="hover:opacity-80 active:scale-98 transition-all duration-150 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-warm-accent rounded-xl"
        >
          <NavBrand size="sm" />
        </button>

        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-warm-brown hover:text-warm-dark hover:bg-warm-beige/60 transition-colors duration-150"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zona derecha — desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user && (
            <button onClick={() => navigate('/profile')} className="text-left hover:bg-warm-beige/50 p-1 rounded-xl transition-colors">
              <UserInfo
                username={user.username}
                avatarSrc={user.avatarUrl}
                layout="horizontal"
              />
            </button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
          >
            <LogOut size={15} />
            Salir
          </Button>
        </div>

        {/* Botón menú móvil */}
        <button
          className="md:hidden p-2 rounded-lg text-warm-brown hover:bg-warm-beige transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden border-t border-warm-beige bg-white"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {user && (
                <button onClick={() => { navigate('/profile'); setMenuOpen(false); }} className="text-left mb-3 pb-3 border-b border-warm-beige w-full hover:bg-warm-beige/50 p-2 rounded-xl transition-colors">
                  <UserInfo
                    username={user.username}
                    avatarSrc={user.avatarUrl}
                    layout="horizontal"
                  />
                </button>
              )}

              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => { navigate(item.href); setMenuOpen(false); }}
                  className="text-left px-3 py-2.5 rounded-xl text-sm font-medium text-warm-brown hover:text-warm-dark hover:bg-warm-beige/60 transition-colors"
                >
                  {item.label}
                </button>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="mt-2 justify-start"
              >
                <LogOut size={15} />
                Cerrar sesión
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
