import React, { useState } from 'react';
import axios from 'axios';


const API_URL = 'http://localhost:3000/api';

function Upload({ images, setImages, logout, token }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select an image to upload.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${API_URL}/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      
      setSuccess('Image uploaded successfully!');
      setFile(null);
      
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      
      setImages((prevImages) => [res.data, ...prevImages]);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload image. Make sure the backend is running.');
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload-section">
      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}
      
      <form className="upload-form" onSubmit={handleUpload}>
        <div className="file-input-wrapper">
          <label htmlFor="file-upload" className="file-input-label">
            {file ? 'Click to change file' : 'Click to select an image or drag and drop'}
          </label>
          <input 
            id="file-upload"
            type="file" 
            className="file-input" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          {file && <div className="selected-file">{file.name}</div>}
        </div>
        
        <button 
          type="submit" 
          className="btn-upload" 
          disabled={loading || !file}
        >
          {loading ? 'Uploading to MinIO...' : 'Upload Image'}
        </button>
      </form>
    </section>
  );
}

export default Upload;
