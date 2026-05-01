import React from 'react';
import { useAuth } from '../viewmodels/useAuth';
import { useNavigate } from 'react-router-dom';

export const DashboardView = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-warm-cream p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-semibold text-warm-dark">MyWardrobe</h1>
          <button 
            onClick={handleLogout}
            className="text-warm-brown hover:text-warm-dark transition-colors font-medium text-sm"
          >
            Logout
          </button>
        </header>

        <main className="bg-white p-8 rounded-2xl shadow-sm border border-warm-beige">
          <h2 className="text-xl text-warm-dark mb-4">Welcome back, {user?.username}!</h2>
          <p className="text-warm-brown/80 mb-6">Your wardrobe dashboard is ready. Start adding your favorite items to create amazing outfits.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-warm-cream/50 p-6 rounded-xl border border-warm-beige flex flex-col items-center justify-center text-center hover:bg-warm-cream transition-colors cursor-pointer h-40">
              <span className="text-3xl mb-2">👕</span>
              <span className="font-medium text-warm-dark">Add New Item</span>
            </div>
            <div className="bg-warm-cream/50 p-6 rounded-xl border border-warm-beige flex flex-col items-center justify-center text-center hover:bg-warm-cream transition-colors cursor-pointer h-40">
              <span className="text-3xl mb-2">✨</span>
              <span className="font-medium text-warm-dark">Create Outfit</span>
            </div>
            <div className="bg-warm-cream/50 p-6 rounded-xl border border-warm-beige flex flex-col items-center justify-center text-center hover:bg-warm-cream transition-colors cursor-pointer h-40">
              <span className="text-3xl mb-2">🧥</span>
              <span className="font-medium text-warm-dark">Browse Wardrobe</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
