import React, { useRef, useState, useEffect } from 'react';
import { Circle } from 'lucide-react'; // npm install lucide-react

const VideoCapture = ({ onVideoReady }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const startRecording = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(mediaStream);
    videoRef.current.srcObject = mediaStream;
    recordedChunks.current = [];
    const mr = new MediaRecorder(mediaStream);
    mediaRecorderRef.current = mr;

    mr.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.current.push(e.data);
    };

   mr.onstop = () => {
  const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
  const file = new File([blob], 'capture.webm', { type: blob.type });
  const url = URL.createObjectURL(file);
  setVideoUrl(url);
  onVideoReady?.(file); // <-- Garde ceci comme actuellement
};


    mr.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    stream.getTracks().forEach(t => t.stop());
    setIsRecording(false);
  };

  // cleanup en cas de démontage
  useEffect(() => () => stream?.getTracks().forEach(t => t.stop()), [stream]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">🎥 Enregistrement Webcam</h2>
      <video ref={videoRef} autoPlay muted className="w-full rounded mb-4 bg-black" />
      <div className="flex justify-center gap-4 mb-4">
        {!isRecording ? (
          <button onClick={startRecording}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            <Circle className="w-5 h-5 mr-2 text-red-500 animate-pulse"/>
            Démarrer
          </button>
        ) : (
          <button onClick={stopRecording}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            <Circle className="w-5 h-5 mr-2 text-red-200 animate-pulse"/>
            Arrêter
          </button>
        )}
      </div>
      {videoUrl && (
        <div>
          <h3 className="text-lg font-medium mb-2 text-center">Prévisualisation</h3>
          <video src={videoUrl} controls className="w-full rounded"/>
        </div>
      )}
    </div>
  );
};

export default VideoCapture;
