import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../viewmodels/useAuth';
import { Shirt } from 'lucide-react';

export const LoginView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(email, password);
      if (success) navigate('/dashboard');
    } else {
      const success = await register(username, email, password);
      if (success) setIsLogin(true); // Switch to login after successful register
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-cream p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-warm-beige w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-warm-beige p-3 rounded-full mb-4">
            <Shirt className="text-warm-brown w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-warm-dark">
            {isLogin ? 'Welcome Back' : 'Join MyWardrobe'}
          </h2>
          <p className="text-warm-brown/70 text-sm mt-2 text-center">
            {isLogin 
              ? 'Enter your details to access your wardrobe' 
              : 'Create an account to organize your style'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="block text-sm font-medium text-warm-dark mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-warm-beige bg-warm-cream/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-warm-accent transition-all duration-300"
                placeholder="StyleGuru99"
                required={!isLogin}
              />
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-warm-dark mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-warm-beige bg-warm-cream/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-warm-accent transition-all duration-300"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-dark mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-warm-beige bg-warm-cream/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-warm-accent transition-all duration-300"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-warm-dark hover:bg-warm-brown text-white py-3 rounded-xl font-medium transition-colors duration-300 flex justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-warm-brown hover:text-warm-accent transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
