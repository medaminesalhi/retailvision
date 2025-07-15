import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-white text-gray-900 min-h-screen flex flex-col justify-center items-center p-8">
      <h1 className="text-4xl font-bold text-center mb-4">🎯 Bienvenue sur RetailVision-TN</h1>
      <p className="text-center max-w-xl text-lg">
        Analyse intelligente d’images et vidéos pour reconnaître produits, promos et rayons en magasin tunisien.
      </p>
      <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
        Commencer l'analyse
      </button>
    </section>
  );
};

export default HeroSection;
