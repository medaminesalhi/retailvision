import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ onImageReady }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    onImageReady(imageSrc); // ✅ envoie l'image au parent
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">📸 Webcam Active</h2>

      {!capturedImage ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-md w-full max-w-md mx-auto"
          />
          <button
            onClick={capture}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Capturer l'image
          </button>
        </>
      ) : (
        <>
          <img src={capturedImage} alt="captured" className="rounded-md w-full max-w-md mx-auto" />
          <button
            onClick={() => {
              setCapturedImage(null);
              onImageReady(null); // réinitialise aussi chez le parent
            }}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Recommencer
          </button>
        </>
      )}
    </div>
  );
};

export default WebcamCapture;
