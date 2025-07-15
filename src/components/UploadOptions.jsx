import React, { useState, useEffect } from 'react';
import WebcamCapture   from './WebcamCapture';
import ImageUploader   from './ImageUploader';
import ImageFromIP     from './ImageFromIP';
import VideoUploader   from './VideoUploader';
import VideoFromIP     from './VideoFromIP';
import VideoCapture    from './VideoCapture';
import logo            from '../assets/vv.jpg';

const UploadOptions = () => {
  // IMAGE
  const [showWebcam, setShowWebcam]       = useState(false);
  const [showUploader, setShowUploader]   = useState(false);
  const [showIpImage, setShowIpImage]     = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageResult, setImageResult]     = useState(null);

  // VIDÉO
  const [showVideoCapture, setShowVideoCapture]   = useState(false);
  const [showVideoUploader, setShowVideoUploader] = useState(false);
  const [showVideoFromIP, setShowVideoFromIP]     = useState(false);
  
  const [selectedVideoData, setSelectedVideoData] = useState({ file: null, url: null });

  // fichier et URL pour preview
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [selectedVideoURL,  setSelectedVideoURL]  = useState(null);

  // résultat du back pour vidéo
  const [videoResult,      setVideoResult]        = useState(null);

  // création de l’URL locale dès qu’on choisit un File
  useEffect(() => {
    if (!selectedVideoFile) {
      setSelectedVideoURL(null);
      return;
    }
    const url = URL.createObjectURL(selectedVideoFile);
    setSelectedVideoURL(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedVideoFile]);

  // === ANALYSE IMAGE ===
  const handleAnalyzeImage = async () => {
    if (!selectedImage) return alert("Aucune image sélectionnée.");
    const fd = new FormData();
    if (typeof selectedImage === 'string') {
      const r = await fetch(selectedImage);
      const b = await r.blob();
      fd.append('image', new File([b], 'capture.jpg', { type: b.type }));
    } else {
      fd.append('image', selectedImage);
    }
    fd.append('source', 'frontend');

    const res = await fetch('http://localhost:8000/api/process-image/', {
      method: 'POST',
      body: fd
    });
    if (!res.ok) return alert("Erreur au traitement de l'image");
    const json = await res.json();
    setImageResult(json);
  };

  // === ANALYSE VIDÉO ===
  const handleAnalyzeVideo = async () => {
    if (!selectedVideoFile) return alert("Aucune vidéo sélectionnée.");
    const fd = new FormData();
    fd.append('video', selectedVideoFile);

    const res = await fetch('http://localhost:8000/api/process-video/', {
      method: 'POST',
      body: fd
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Backend video error", err);
      return alert("Erreur au traitement vidéo");
    }
    const json = await res.json();
    setVideoResult(json);
  };

  return (
    <section className="min-h-screen bg-[#dceeff] flex flex-col items-center p-8">
      <img src={logo} alt="Logo" className="w-40 mb-6 rounded shadow" />
      <h2 className="text-3xl font-bold mb-2">Choisissez une méthode d'import</h2>
      <p className="mb-10 text-gray-600 text-center max-w-xl">
        Importez une image ou une vidéo pour détecter automatiquement catégories, promotions et zones.
      </p>

      {/* BLOCS D’IMPORT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* IMAGE */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-4">📸 Image</h3>
          <button className="w-full bg-blue-600 text-white py-2 rounded mb-2"
                  onClick={()=> setShowWebcam(true)}>Webcam</button>
          <button className="w-full bg-gray-200 text-gray-800 py-2 rounded mb-2"
                  onClick={()=> setShowUploader(true)}>Fichier</button>
          <button className="w-full bg-yellow-100 text-yellow-800 py-2 rounded"
                  onClick={()=> setShowIpImage(true)}>Adresse IP</button>
        </div>
        {/* VIDÉO */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-4">🎞️ Vidéo</h3>
          <button className="w-full bg-blue-600 text-white py-2 rounded mb-2"
                  onClick={()=> setShowVideoCapture(true)}>Webcam</button>
          <button className="w-full bg-gray-200 text-gray-800 py-2 rounded mb-2"
                  onClick={()=> setShowVideoUploader(true)}>Fichier</button>
          <button className="w-full bg-yellow-100 text-yellow-800 py-2 rounded"
                  onClick={()=> setShowVideoFromIP(true)}>Adresse IP</button>
        </div>
      </div>

      {/* COMPOSANTS DYNAMIQUES */}
      {showWebcam      && <WebcamCapture  onImageReady={setSelectedImage}/>}
      {showUploader    && <ImageUploader  onImageReady={setSelectedImage}/>}
      {showIpImage     && <ImageFromIP    onImageReady={setSelectedImage}/>}
      {showVideoCapture && (
  <VideoCapture
    onVideoReady={(file) => {
      setSelectedVideoFile(file);
      setSelectedVideoURL(URL.createObjectURL(file));
    }}
  />
)}

      {showVideoUploader&&<VideoUploader  onVideoReady={setSelectedVideoFile}/>}
      {showVideoFromIP && <VideoFromIP    onVideoReady={setSelectedVideoFile}/>}

      {/* PRÉVIEW + BOUTONS */}
      {selectedImage && (
        <div className="mt-6 text-center">
          <img src={selectedImage} className="max-w-xs rounded shadow mb-4" />
          <button onClick={handleAnalyzeImage} className="bg-blue-700 text-white px-6 py-2 rounded">
            Analyser l’image
          </button>
        </div>
      )}
      {selectedVideoURL && (
        <div className="mt-6 text-center w-full max-w-lg">
          <video src={selectedVideoURL} controls className="w-full rounded mb-4"/>
          <button onClick={handleAnalyzeVideo} className="bg-green-600 text-white px-6 py-2 rounded">
            Analyser la vidéo
          </button>
        </div>
      )}

      {/* RÉSULTATS IMAGE */}
      {imageResult && (
        <div className="mt-8 bg-white p-6 rounded shadow max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">✅ Résultat Image</h3>
          <p><strong>Catégories :</strong> {imageResult.categories.join(', ')}</p>
          <p><strong>OCR :</strong> {imageResult.ocr_text.join(', ')}</p>
          <img src={`http://localhost:8000${imageResult.image_path}`}
               className="mt-4 rounded w-full" />
        </div>
      )}

      {/* RÉSULTATS VIDÉO */}
      {videoResult?.frames?.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded shadow max-w-5xl">
          <h3 className="text-xl font-semibold mb-4">🎯 Résultats Vidéo</h3>
          <video src={`http://localhost:8000${videoResult.video_url}`}
                 controls className="w-full rounded mb-6"/>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videoResult.frames.map((f,i)=>(
              <div key={i} className="bg-gray-50 p-3 rounded shadow">
                <img src={`http://localhost:8000${f.frame}`}
                     className="w-full rounded mb-2"/>
                <p><strong>Catégories :</strong> {f.yolo.join(', ')}</p>
                <p><strong>OCR :</strong> {f.ocr.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default UploadOptions;
