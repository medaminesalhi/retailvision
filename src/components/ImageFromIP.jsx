import React, { useState } from 'react';

const ImageFromIP = ({ onImageReady }) => {
  const [ipUrl, setIpUrl] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    if (!ipUrl.startsWith('http://') && !ipUrl.startsWith('https://')) {
      alert("Merci d'entrer une URL valide.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(ipUrl);

      if (!response.ok) throw new Error("Impossible de télécharger l'image.");

      const blob = await response.blob();
      const file = new File([blob], 'ip_image.jpg', { type: blob.type });

      // ✅ Preview dans React
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // ✅ Transmettre au parent (UploadOptions)
      onImageReady(file);
    } catch (error) {
      alert("Erreur : " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow w-full max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-4">🌐 Charger une image via adresse IP</h3>
      <input
        type="text"
        placeholder="http://192.168.x.x:xxxx/shot.jpg"
        value={ipUrl}
        onChange={(e) => setIpUrl(e.target.value)}
        className="w-full border px-4 py-2 rounded mb-4"
      />
      <button
        onClick={handleLoad}
        disabled={loading}
        className={`w-full px-4 py-2 rounded text-white transition ${
          loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Chargement...' : "Charger l'image"}
      </button>

      {preview && (
        <img
          src={preview}
          alt="Prévisualisation"
          className="mt-4 rounded shadow w-full"
        />
      )}
    </div>
  );
};

export default ImageFromIP;
