import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { OutfitGeneratorModal } from '../components/organisms/OutfitGeneratorModal';
import { useOutfits } from '../viewmodels/useOutfits';
import { useItems } from '../viewmodels/useItems';
import { Button } from '../components/atoms/Button';
import { OutfitCard } from '../components/molecules/OutfitCard';
import { Plus, Sparkles } from 'lucide-react';

export const OutfitsView: React.FC = () => {
  const navigate = useNavigate();
  const { outfits, loading, fetchOutfits, createOutfit } = useOutfits();
  const { items, fetchItems } = useItems();
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    fetchOutfits();
    fetchItems();
  }, [fetchOutfits, fetchItems]);

  const handleSaveGenerated = async (name: string, itemIds: number[]): Promise<boolean> => {
    const result = await createOutfit({ name, itemIds });
    if (result) {
      await fetchOutfits(); // Refrescar la lista con el nuevo outfit
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
        <header className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-warm-dark leading-tight">Mis Outfits</h1>
            <p className="text-warm-brown mt-1">Tus combinaciones favoritas guardadas.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowGenerator(true)}
              disabled={items.length === 0}
              title={items.length === 0 ? 'Añade prendas a tu armario primero' : 'Generar outfit automáticamente'}
            >
              <Sparkles size={15} />
              Generar sugerencia
            </Button>
            <Button variant="primary" onClick={() => navigate('/outfits/new')}>
              <Plus size={16} />
              Crear outfit
            </Button>
          </div>
        </header>

        <section>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-warm-beige animate-pulse bg-warm-beige/30">
                  <div className="aspect-square w-full bg-warm-beige/50" />
                  <div className="px-4 py-3 space-y-2">
                    <div className="h-3 bg-warm-beige/60 rounded w-2/3" />
                    <div className="h-2 bg-warm-beige/40 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : outfits.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">✨</span>
              <p className="text-warm-brown mb-6">Aún no has creado ningún outfit.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button variant="secondary" onClick={() => setShowGenerator(true)} disabled={items.length === 0}>
                  <Sparkles size={15} />
                  Generar sugerencia
                </Button>
                <Button variant="primary" onClick={() => navigate('/outfits/new')}>
                  Crear manualmente
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {outfits.map(outfit => (
                <OutfitCard
                  key={outfit.id}
                  name={outfit.name}
                  description={outfit.description}
                  itemCount={outfit.itemIds?.length ?? 0}
                  previewImageUrls={outfit.previewImageUrls}
                  onClick={() => navigate(`/outfits/${outfit.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <OutfitGeneratorModal
        isOpen={showGenerator}
        items={items}
        onClose={() => setShowGenerator(false)}
        onSave={handleSaveGenerated}
      />
    </div>
  );
};
