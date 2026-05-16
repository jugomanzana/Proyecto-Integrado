import React, { useEffect } from 'react';
import { useNavigate }      from 'react-router-dom';
import { useAuth }          from '../viewmodels/useAuth';
import { useItems }         from '../viewmodels/useItems';
import { Navbar }           from '../components/organisms/Navbar';
import { WardrobeGrid }     from '../components/organisms/WardrobeGrid';
import { ActionCard }       from '../components/molecules/ActionCard';

// ============================================================
// PÁGINA: DashboardView
// Nivel "Page" del Atomic Design.
// Orquesta el layout y conecta el viewmodel con los organismos.
// ============================================================

export const DashboardView: React.FC = () => {
  const { user }                                    = useAuth();
  const navigate                                    = useNavigate();
  const { items, loading, fetchItems }              = useItems();

  // Cargar prendas al montar la vista (solo las últimas 4 para el dashboard)
  useEffect(() => { fetchItems({ limit: 4 }); }, [fetchItems]);

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      {/* Organismo: barra de navegación */}
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">

        {/* Saludo */}
        <section>
          <h1 className="text-3xl font-bold text-warm-dark leading-tight">
            Hola, {user?.username} 👋
          </h1>
          <p className="text-warm-brown mt-1">
            ¿Qué quieres organizar hoy?
          </p>
        </section>

        {/* Acciones rápidas — moléculas ActionCard */}
        <section aria-label="Acciones rápidas">
          <h2 className="text-xl font-semibold text-warm-dark mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionCard
              icon="👕"
              title="Añadir prenda"
              description="Sube una nueva pieza a tu armario"
              onClick={() => navigate('/items/new')}
            />
            <ActionCard
              icon="✨"
              title="Crear outfit"
              description="Combina prendas y guarda el look"
              onClick={() => navigate('/outfits/new')}
            />
            <ActionCard
              icon="🧥"
              title="Ver armario"
              description="Explora y filtra tu colección"
              onClick={() => navigate('/items')}
            />
          </div>
        </section>

        {/* Organismo: cuadrícula del armario */}
        <section aria-label="Mi armario">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-warm-dark">Últimas prendas añadidas</h2>
            <button 
              onClick={() => navigate('/items')}
              className="text-sm font-semibold text-warm-accent hover:text-warm-dark transition-colors"
            >
              Ver todas →
            </button>
          </div>
          <WardrobeGrid
            items={items}
            loading={loading}
            onAddItem={() => navigate('/items/new')}
            onItemClick={(item) => navigate(`/items/${item.id}`)}
          />
        </section>

      </main>
    </div>
  );
};

