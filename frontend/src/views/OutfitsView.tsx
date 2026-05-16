import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { useOutfits } from '../viewmodels/useOutfits';
import { Button } from '../components/atoms/Button';
import { Plus } from 'lucide-react';
import { ActionCard } from '../components/molecules/ActionCard';

export const OutfitsView: React.FC = () => {
  const navigate = useNavigate();
  const { outfits, loading, fetchOutfits } = useOutfits();

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
        <header className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-warm-dark leading-tight">Mis Outfits</h1>
            <p className="text-warm-brown mt-1">Tus combinaciones favoritas guardadas.</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/outfits/new')}>
            <Plus size={16} />
            Crear outfit
          </Button>
        </header>

        <section>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-40 bg-warm-beige/50 animate-pulse rounded-2xl" />
               ))}
            </div>
          ) : outfits.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">✨</span>
              <p className="text-warm-brown mb-6">Aún no has creado ningún outfit.</p>
              <Button variant="secondary" onClick={() => navigate('/outfits/new')}>
                Empieza a combinar
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfits.map(outfit => (
                <ActionCard
                  key={outfit.id}
                  icon="✨"
                  title={outfit.name}
                  description={outfit.description || `${outfit.itemIds.length} prendas`}
                  onClick={() => navigate(`/outfits/${outfit.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
