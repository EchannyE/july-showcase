import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const OcrUploader = () => {
  // State for managing the file and its preview
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  // State for managing the upload status and progress
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();

  // Handle file selection from the input
  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a preview URL. Handle both images and PDFs.
      if (selectedFile.type === 'application/pdf') {
        setPreview('pdf');
      } else {
        setPreview(URL.createObjectURL(selectedFile));
      }
    }
  }, []);

  // Handle the file upload process
  const handleUpload = useCallback(async () => {
    if (!file) {
      toast.error('Please select a file before uploading.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file); // The backend expects the key to be 'image'

    try {
      const res = await axios.post('http://localhost:8080/api/ocr/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Track the upload progress
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
        withCredentials: true,
      });

      if (res.status === 201) {
        toast.success('Upload and OCR successful!');
        // Navigate to the receipts page on successful upload
        navigate('/receipts', { state: { refresh: true } });
      } else {
        toast.error(res.data.message || 'Upload failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred during upload.');
    } finally {
      // Reset the state after upload is complete
      setUploading(false);
      setUploadProgress(0);
      setFile(null);
      setPreview(null);
    }
  }, [file, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 font-inter">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <div className="w-full max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          Upload Receipt
        </h2>

        {/* File input and preview section */}
        <div className="flex flex-col items-center">
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
              ${
                file
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              } dark:border-gray-600 dark:bg-gray-800`}
          >
            {preview ? (
              preview === 'pdf' ? (
                <div className="flex flex-col items-center text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V8h2v4zm-1-7h2v2h-2V5zM15 15h-2v2h2v-2zM15 11h-2v2h2v-2zM15 7h-2v2h2V7z"/>
                  </svg>
                  <span className="mt-2 text-sm font-semibold">{file?.name}</span>
                </div>
              ) : (
                <img src={preview} alt="File preview" className="max-h-44 object-contain rounded-md" />
              )
            ) : (
              <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.28 2.29a.75.75 0 011.06 0l5.5 5.5a.75.75 0 010 1.06l-13.97 13.97a.75.75 0 01-.53.22H3a1 1 0 01-1-1v-4.28a.75.75 0 01.22-.53L13.22 2.29zM15.03 3.35l-11.45 11.45L3 15v3.5l1.5.5h3.5l11.45-11.45-5.5-5.5zM17.56 5.88l-1.06-1.06 4.47-4.47 1.06 1.06-4.47 4.47z"/>
                </svg>
                <span className="font-semibold text-lg text-center">Click or drag a file here</span>
                <span className="text-sm mt-1">Image or PDF files are accepted</span>
              </div>
            )}
            <input id="file-upload" type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        {/* Upload button and progress bar */}
        <div className="mt-6 space-y-4">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full px-5 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg
              ${
                uploading || !file
                  ? 'bg-indigo-300 dark:bg-indigo-600 dark:text-indigo-200 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400'
              }`}
          >
            {uploading ? 'Uploading...' : 'Upload and Process'}
          </button>

          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OcrUploader;
