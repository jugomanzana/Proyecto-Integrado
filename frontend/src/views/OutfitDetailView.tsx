import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { useOutfits } from '../viewmodels/useOutfits';
import { Button } from '../components/atoms/Button';
import { Avatar } from '../components/atoms/Avatar';
import { ArrowLeft, Edit2 } from 'lucide-react';
import type { OutfitDetalle } from '../models/interfaces';

export const OutfitDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchOutfitById, loading } = useOutfits();
  const [outfit, setOutfit] = useState<OutfitDetalle | null>(null);

  useEffect(() => {
    if (id) {
      fetchOutfitById(Number(id)).then(fetched => {
        if (fetched) {
          setOutfit(fetched);
        } else {
          navigate('/outfits');
        }
      });
    }
  }, [id, fetchOutfitById, navigate]);

  if (loading || !outfit) {
    return (
      <div className="min-h-screen bg-warm-cream flex flex-col">
        <Navbar />
        <main className="flex-1 flex justify-center items-center">
          <div className="animate-pulse w-8 h-8 rounded-full border-2 border-warm-accent border-t-transparent" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
        <div>
          <Link to="/outfits" className="inline-flex items-center gap-2 text-sm font-medium text-warm-brown hover:text-warm-dark transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-accent rounded">
            <ArrowLeft size={16} />
            Volver a mis outfits
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-warm-beige overflow-hidden p-8 md:p-10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-warm-beige pb-6">
            <div>
              <h1 className="text-3xl font-bold text-warm-dark leading-tight">{outfit.name}</h1>
              {outfit.description && (
                <p className="text-warm-brown mt-2 max-w-2xl">{outfit.description}</p>
              )}
            </div>
            <Button variant="secondary" onClick={() => navigate(`/outfits/${outfit.id}/edit`)}>
              <Edit2 size={16} />
              Editar Outfit
            </Button>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-warm-dark mb-6">
              Prendas de este outfit ({outfit.items?.length || 0})
            </h2>

            {(!outfit.items || outfit.items.length === 0) ? (
              <p className="text-warm-brown">No hay prendas asociadas a este outfit.</p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {outfit.items.map(item => (
                  <li key={item.id} className="group relative w-full aspect-square rounded-xl overflow-hidden border border-warm-beige bg-warm-beige/20 hover:border-warm-accent/50 hover:shadow-sm transition-all duration-200">
                    <button type="button" aria-label={`Ver detalle de prenda ${item.name}`} onClick={() => navigate(`/items/${item.id}`)} className="w-full h-full text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-warm-accent inset-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Avatar alt={item.name} size="lg" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
                        <p className="text-white text-xs font-medium truncate">{item.name}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
