import { useCallback, useState } from 'react';
import { parseCSV } from '../utils/dataProcessing';

export default function FileUpload({ onDataLoaded, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      onError('Please upload a CSV file');
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    try {
      const result = await parseCSV(file);
      if (result.data.length === 0) {
        onError('The CSV file is empty');
        return;
      }
      onDataLoaded(result);
    } catch (error) {
      onError(error.message || 'Failed to parse CSV file');
    } finally {
      setIsLoading(false);
    }
  }, [onDataLoaded, onError]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    handleFile(file);
  }, [handleFile]);

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
        role="button"
        tabIndex={0}
        aria-label="Upload CSV file"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            document.getElementById('file-input').click();
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
          aria-hidden="true"
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Processing {fileName}...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold text-blue-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500">CSV files only</p>
            {fileName && (
              <p className="text-sm text-green-600 mt-2">
                Last uploaded: {fileName}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
