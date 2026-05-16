import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../viewmodels/useItems';
import { Navbar } from '../components/organisms/Navbar';
import { WardrobeGrid } from '../components/organisms/WardrobeGrid';

export const ItemsView: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, hasMore, fetchItems, loadMoreItems } = useItems();

  // Carga inicial
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFilterChange = useCallback(({ search, category, season, color }: { search: string, category: string, season: string, color: string }) => {
    fetchItems({
      search,
      category: category === 'Todas' ? undefined : category,
      season: season === 'Todas' ? undefined : season,
      color: color === 'Todos' ? undefined : color
    });
  }, [fetchItems]);

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold text-warm-dark leading-tight">Tu Armario Completo</h1>
          <p className="text-warm-brown mt-1">Explora, busca y filtra toda tu colección de ropa.</p>
        </header>

        <WardrobeGrid
          items={items}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMoreItems}
          onFilterChange={handleFilterChange}
          onAddItem={() => navigate('/items/new')}
          onItemClick={(item) => navigate(`/items/${item.id}`)}
        />
      </main>
    </div>
  );
};
