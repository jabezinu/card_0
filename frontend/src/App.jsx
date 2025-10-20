import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { formatUSSD } from './utils';

export default function App() {
  const [scannedCode, setScannedCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    // Check if BarcodeDetector is available
    if ('BarcodeDetector' in window) {
      codeReaderRef.current = new BarcodeDetector();
    } else {
      codeReaderRef.current = new BrowserMultiFormatReader();
    }
  }, []);

  const requestCameraPermission = async () => {
    try {
      // Check if we're on HTTPS or localhost
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      if (!isSecure) {
        setError('Camera access requires HTTPS. Please use a secure connection.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissionGranted(true);
      setError('');
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please enable camera access and refresh.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Camera access failed. Please try again.');
      }
      console.error('Camera permission denied:', err);
    }
  };

  const startScanning = async () => {
    if (!permissionGranted) {
      await requestCameraPermission();
      if (!permissionGranted) return;
    }

    setIsScanning(true);
    setError('');

    const scan = async () => {
      if (!videoRef.current || !isScanning) return;

      try {
        let result;
        if (codeReaderRef.current instanceof BarcodeDetector) {
          const barcodes = await codeReaderRef.current.detect(videoRef.current);
          if (barcodes.length > 0) {
            result = barcodes[0].rawValue;
          }
        } else {
          // ZXing fallback
          result = await codeReaderRef.current.decodeOnceFromVideoDevice(undefined, videoRef.current);
          if (result) {
            result = result.text;
          }
        }

        if (result && /^\d{12,20}$/.test(result)) {
          setScannedCode(result);
          setIsScanning(false);
        } else if (result) {
          setError('Invalid code — please rescan');
        }
      } catch (err) {
        console.error('Scanning error:', err);
      }

      if (isScanning) {
        requestAnimationFrame(scan);
      }
    };

    scan();
  };

  const stopScanning = () => {
    setIsScanning(false);
  };


  const initiateCall = () => {
    const ussd = formatUSSD(scannedCode);
    const encodedUSSD = encodeURIComponent(ussd);
    window.location.href = `tel:${encodedUSSD}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatUSSD(scannedCode));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Top-Up Card Scanner</h1>

        {!permissionGranted && (
          <button
            onClick={requestCameraPermission}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg mb-4 hover:bg-blue-600"
          >
            Enable Camera
          </button>
        )}

        {permissionGranted && (
          <div className="relative mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 bg-black rounded-lg"
            />
            <div className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-16 border-2 border-green-400 bg-green-400 bg-opacity-20"></div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {permissionGranted && !scannedCode && (
          <div className="flex gap-2">
            <button
              onClick={isScanning ? stopScanning : startScanning}
              className={`flex-1 py-3 px-4 rounded-lg ${
                isScanning
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {isScanning ? 'Stop' : 'Scan'}
            </button>
          </div>
        )}

        {scannedCode && (
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-2">Scanned successfully — ready to insert card</p>
            <p className="bg-gray-100 p-3 rounded mb-4 font-mono">{formatUSSD(scannedCode)}</p>
            <div className="flex gap-2">
              <button
                onClick={initiateCall}
                className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600"
              >
                Insert Card
              </button>
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => {
                setScannedCode('');
                setError('');
              }}
              className="w-full mt-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}