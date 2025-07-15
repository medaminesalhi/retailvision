// src/pages/HistoriquePage.jsx
import React, { useEffect, useState } from 'react';

export default function HistoriquePage() {
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);

  // Exemple de fetch historique depuis votre API
  useEffect(() => {
    // 1) Récupérer historique images
    fetch('http://localhost:8000/api/history-images/')
      .then(r => r.json())
      .then(data => setImages(data))
      .catch(console.error);

    // 2) Récupérer historique vidéos
    fetch('http://localhost:8000/api/history-videos/')
      .then(r => r.json())
      .then(data => setVideos(data))
      .catch(console.error);
  }, []);

  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold mb-4">📚 Historique</h2>
      <div className="grid grid-cols-2 gap-8">
        {/* Colonne Images */}
        <div>
          <h3 className="text-xl mb-2">Images analysées</h3>
          {images.map((img, i) => (
            <div key={i} className="mb-4 p-4 bg-gray-50 rounded shadow">
              <img src={`http://localhost:8000${img.image_path}`} alt="" className="w-full rounded" />
              <p><strong>Catégories :</strong> {img.categories.join(', ')}</p>
              <p><strong>OCR :</strong> {img.ocr_text.join(', ')}</p>
            </div>
          ))}
        </div>

        {/* Colonne Vidéos */}
        <div>
          <h3 className="text-xl mb-2">Vidéos analysées</h3>
          {videos.map((vid, i) => (
            <div key={i} className="mb-6 p-4 bg-gray-50 rounded shadow">
              <video src={`http://localhost:8000${vid.video_url}`} controls className="w-full rounded mb-2" />
              <div className="grid grid-cols-3 gap-2">
                {vid.frames.map((f, j) => (
                  <div key={j}>
                    <img src={`http://localhost:8000${f.frame}`} alt={`Frame ${j}`} className="w-full rounded" />
                    <p className="text-sm"><strong>{f.yolo.join(', ')}</strong></p>
                    <p className="text-xs">{f.ocr.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
