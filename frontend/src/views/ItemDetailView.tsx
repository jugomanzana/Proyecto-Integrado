import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useItems } from '../viewmodels/useItems';
import { Navbar } from '../components/organisms/Navbar';
import { Badge } from '../components/atoms/Badge';
import { Button } from '../components/atoms/Button';
import { Avatar } from '../components/atoms/Avatar';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import type { Prenda } from '../models/interfaces';
import { ConfirmationModal } from '../components/molecules';

export const ItemDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchItemById, deleteItem, loading } = useItems();
  const [item, setItem] = useState<Prenda | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItemById(Number(id)).then(fetchedItem => {
        if (fetchedItem) {
          setItem(fetchedItem);
        } else {
          navigate('/dashboard');
        }
      });
    }
  }, [id, fetchItemById, navigate]);

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    const success = await deleteItem(Number(id));
    if (success) {
      navigate('/dashboard');
    }
  };


  if (loading || !item) {
    return (
      <div className="min-h-screen bg-warm-cream flex flex-col">
        <Navbar />
        <main className="flex-1 flex justify-center items-center">
          <div className="animate-pulse w-8 h-8 rounded-full border-2 border-warm-accent border-t-transparent" />
        </main>
      </div>
    );
  }

  const statusVariant = 
    item.status === 'Disponible' ? 'success' :
    item.status === 'Colada' ? 'warning' : 'info';

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-warm-brown hover:text-warm-dark transition-colors mb-6">
            <ArrowLeft size={16} />
            Volver al armario
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-warm-beige overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/5 aspect-square md:aspect-auto bg-warm-beige/30 flex items-center justify-center p-8">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-[400px] object-contain rounded-xl shadow-sm" />
            ) : (
              <Avatar alt={item.name} size="xl" />
            )}
          </div>
          
          <div className="p-8 md:p-10 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold text-warm-dark leading-tight">{item.name}</h1>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge label={item.category} />
              <Badge label={item.status} variant={statusVariant} dot />
              {item.season && <Badge label={item.season} variant="accent" />}
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-auto">
              {item.color && (
                <div>
                  <h3 className="text-sm font-semibold text-warm-brown tracking-wide mb-1">Color</h3>
                  <p className="text-warm-dark">{item.color}</p>
                </div>
              )}
              {item.fabric && (
                <div>
                  <h3 className="text-sm font-semibold text-warm-brown tracking-wide mb-1">Tejido</h3>
                  <p className="text-warm-dark">{item.fabric}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-8 mt-8 border-t border-warm-beige">
              <Button variant="secondary" className="flex-1" onClick={() => navigate(`/items/${item.id}/edit`)}>
                <Edit2 size={16} />
                Editar
              </Button>
              <Button variant="danger" className="flex-1" onClick={() => setShowDeleteModal(true)}>
                <Trash2 size={16} />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="¿Eliminar prenda?"
        message="¿Seguro que quieres eliminar esta prenda de tu armario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
