// src/components/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/vv.jpg';

export default function HeroSection() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-green-500 p-6 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo & Titre */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="VisShop AI" className="h-12 w-auto" />
          <span className="text-white text-2xl font-extrabold tracking-tight">
            VisShop AI
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-4">
          <Link
            to="/"
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-lg transition"
          >
            Accueil
          </Link>
          <Link
            to="/historique"
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-lg transition"
          >
            Historique
          </Link>
        </nav>
      </div>
    </header>
  );
}
