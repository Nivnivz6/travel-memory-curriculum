import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_URL = 'http://localhost:3000/api';

function App() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userId, setUserId] = useState(null);

  // Initialize a mock user since our backend requires one
  useEffect(() => {
    const initUser = async () => {
      try {
        // Try to fetch users; if none exist, create one
        const res = await axios.get(`${API_URL}/users`);
        if (res.data && res.data.length > 0) {
          setUserId(res.data[0]._id);
        } else {
          // POST to create user - Using random suffix to avoid unique conflicts on reload
          const randomSuffix = Math.floor(Math.random() * 10000);
          const createRes = await axios.post(`${API_URL}/users`, {
            username: `demouser_${randomSuffix}`,
            email: `demo${randomSuffix}@example.com`
          });
          setUserId(createRes.data._id);
        }
      } catch (err) {
        // If GET /users isn't implemented (we only have GET /users/:id), just try to create one directly
        try {
          const randomSuffix = Math.floor(Math.random() * 10000);
          const createRes = await axios.post(`${API_URL}/users`, {
            username: `demouser_${randomSuffix}`,
            email: `demo${randomSuffix}@example.com`
          });
          setUserId(createRes.data._id);
        } catch (e) {
          console.error("Failed to initialize user:", e);
        }
      }
    };
    
    initUser();
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/images`);
      setImages(res.data);
    } catch (err) {
      console.error('Failed to fetch images:', err);
      // We don't set error here so it doesn't interrupt the user flow just on load
    }
  };

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

    if (!userId) {
      setError('System is initializing user. Please wait a second and try again.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', userId);

    try {
      await axios.post(`${API_URL}/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess('Image uploaded successfully!');
      setFile(null);
      // Reset input element
      document.getElementById('file-upload').value = '';
      
      // Refresh gallery
      fetchImages();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload image. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Travel Memory App</h1>
        <p>Upload and share your favorite travel moments</p>
      </header>

      <main>
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

        <section className="gallery-section">
          <h2>Your Uploads</h2>
          
          {images.length === 0 ? (
            <div className="empty-state">
              <p>No images uploaded yet. Upload your first travel memory above!</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map((img) => (
                <div key={img._id} className="gallery-item">
                  <div className="image-wrapper">
                    <img 
                      src={img.s3Url} 
                      alt={img.filename} 
                      className="gallery-img"
                      onError={(e) => {
                        // Fallback if MinIO URL is broken/inaccessible
                        e.target.style.display = 'none';
                        e.target.parentElement.style.display = 'flex';
                        e.target.parentElement.style.alignItems = 'center';
                        e.target.parentElement.style.justifyContent = 'center';
                        e.target.parentElement.innerText = 'Image broken / Private';
                      }}
                    />
                  </div>
                  <div className="image-info">
                    <p className="image-name" title={img.filename}>{img.filename}</p>
                    <span className={`status-badge ${img.status}`}>
                      {img.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
