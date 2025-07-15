import React, { useState } from 'react';

const VideoFromIP = ({ onVideoReady }) => {
  const [ipUrl, setIpUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);

  const handleLoad = () => {
    if (!ipUrl) {
      alert("Veuillez entrer une URL de flux vidéo.");
      return;
    }

    setVideoUrl(ipUrl);
    onVideoReady(ipUrl);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
      <h3 className="text-lg font-semibold mb-4">📡 Charger une vidéo via adresse IP</h3>
      <input
        type="text"
        placeholder="http://192.168.1.100:8080/video"
        value={ipUrl}
        onChange={(e) => setIpUrl(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
      />
      <button
        onClick={handleLoad}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Charger la vidéo
      </button>

      {videoUrl && (
        <div className="mt-4">
          <video src={videoUrl} controls className="rounded-lg max-w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default VideoFromIP;
