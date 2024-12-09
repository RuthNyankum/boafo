import React from 'react';

interface OCRResultProps {
  image: string;
  isProcessing: boolean;
  ocrResult: string;
}

const OCRResult: React.FC<OCRResultProps> = ({ 
  image, 
  isProcessing, 
  ocrResult 
}) => {
  return (
    <>
      {image && (
        <img
          src={image}
          alt="Captured Screenshot"
          className="mb-6 w-full rounded-md"
        />
      )}
      {isProcessing && <p>Processing image... Please wait.</p>}
      {ocrResult && (
        <p className="mt-4 text-gray-700">Extracted Text: {ocrResult}</p>
      )}
    </>
  );
};

export default OCRResult;