// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import { FileUp } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// const ReceiptUpload = () => {
//   const [file, setFile] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef();

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setResult(null); // Clear previous result on new file
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       toast.error('Please select a file.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('receipt', file);

//     try {
//       setLoading(true);

//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('Please login to upload receipts.');
//         return;
//       }
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/upload-receipt`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       toast.success('Receipt uploaded successfully!');
//       setResult(res.data);
//       setFile(null);
//       if (fileInputRef.current) fileInputRef.current.value = '';
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error(error?.response?.data?.message || 'Upload failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-aiPrimary dark:bg-aiPrimary-dark text-aiText dark:text-aiText-dark transition-colors p-4">
//       <div className="bg-white dark:bg-background rounded-xl shadow-xl p-6 max-w-md w-full text-center">
//         <FileUp size={40} className="mx-auto mb-3 text-aiAccent" />
//         <h2 className="text-2xl font-bold mb-2 text-aiAccent">Upload Receipt</h2>
//         <p className="mb-4 text-aiText">
//           Upload a receipt to parse with AI and extract your transaction details automatically.
//         </p>

//         <input
//           type="file"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           className="w-full p-2 mb-4 border border-aiAccent rounded cursor-pointer bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
//           accept="image/*,application/pdf"
//         />
//         <button
//           onClick={handleUpload}
//           disabled={loading || !file}
//           className="w-full bg-aiAccent text-white py-2 rounded hover:bg-aiAccent-dark transition font-semibold"
//         >
//           {loading ? 'Uploading...' : 'Upload'}
//         </button>

//         {result && (
//           <div className="mt-6 text-left">
//             <p className="font-semibold text-aiAccent mb-1">Extracted Text:</p>
//             <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-40 overflow-auto text-sm whitespace-pre-wrap">
//               {result.extractedText || 'No text extracted.'}
//             </pre>
//             <p className="font-semibold text-aiAccent mt-4 mb-1">Transaction Parsed:</p>
//             <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm whitespace-pre-wrap">
//               {result.transaction ? JSON.stringify(result.transaction, null, 2) : 'No transaction parsed.'}
//             </pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReceiptUpload;