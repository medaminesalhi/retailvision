import React, { useState, useRef } from 'react';

const ImageUploader = ({ onImageReady }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    previewImage(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    previewImage(file);
  };

  const previewImage = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageReady(reader.result); // ✅ transmet l'image au parent
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="w-full max-w-md mx-auto bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition"
      onClick={() => fileInputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {preview ? (
        <img src={preview} alt="Prévisualisation" className="rounded-md shadow w-full" />
      ) : (
        <p className="text-gray-500">Cliquez ou glissez une image ici</p>
      )}
    </div>
  );
};

export default ImageUploader;
