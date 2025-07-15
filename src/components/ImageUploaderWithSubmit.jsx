import React, { useState, useRef } from 'react';
import axios from 'axios';

const ImageUploaderWithSubmit = () => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Aucune image sélectionnée");

    const formData = new FormData();
    formData.append('image', file);
    formData.append('source', 'test');

    try {
      const res = await axios.post('http://localhost:8000/api/process-image/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de l'image.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow w-full max-w-md mx-auto mt-10">
      <h2 className="text-lg font-semibold mb-4">📤 Tester l'envoi d'une image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={fileInputRef}
        className="mb-4"
      />

      {preview && <img src={preview} alt="Preview" className="rounded shadow mb-4" />}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Envoyer et analyser
      </button>

      {result && (
        <div className="mt-6 text-left">
          <h3 className="font-semibold mb-2">✅ Résultat :</h3>
          <p><strong>Catégories :</strong> {result.categories.join(', ')}</p>
          <p><strong>Textes OCR :</strong> {result.ocr_text.join(', ')}</p>
          <img src={`http://localhost:8000${result.image_path}`} alt="Analysée" className="mt-4 rounded shadow" />
        </div>
      )}
    </div>
  );
};

export default ImageUploaderWithSubmit;
