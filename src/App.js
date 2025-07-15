// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeroSection     from './components/HeroSection';
import UploadOptions   from './components/UploadOptions';
import HistoriquePage  from './pages/HistoriquePage';

export default function App() {
  return (
    <>
      <HeroSection />

      <main className="px-4 py-8">
        <Routes>
          {/* Page principale */}
          <Route path="/" element={<UploadOptions />} />
          {/* Page historique */}
          <Route path="/historique" element={<HistoriquePage />} />
        </Routes>
      </main>
    </>
  );
}