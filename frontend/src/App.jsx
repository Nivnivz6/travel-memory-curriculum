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
  
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Auth Form State
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Setup Axios interceptor to always attach token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Fetch images when token changes (or initial load if stored)
  useEffect(() => {
    if (token) {
      fetchImages();
    }
  }, [token]);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/images`);
      setImages(res.data);
    } catch (err) {
      console.error('Failed to fetch images:', err);
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  const handleAuthChange = (e) => {
    setAuthForm({
      ...authForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
      const payload = isLoginMode 
        ? { email: authForm.email, password: authForm.password }
        : authForm;
        
      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      
      // Save auth data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setToken(res.data.token);
      setUser(res.data);
      
      // Clear form
      setAuthForm({ username: '', email: '', password: '' });
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setImages([]);
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

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${API_URL}/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess('Image uploaded successfully!');
      setFile(null);
      
      // Reset input element
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      
      // Instantly render the new image by appending to state array
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

  // ------------------------------------------------------------------------
  // Render Auth View if not logged in
  // ------------------------------------------------------------------------
  if (!token) {
    return (
      <div className="container">
        <header className="header">
          <h1>Travel Memory App</h1>
          <p>Login to upload and share your favorite travel moments</p>
        </header>

        <main className="auth-container" style={{ maxWidth: '400px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h2>
          
          {error && <div className="message error">{error}</div>}

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {!isLoginMode && (
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                value={authForm.username} 
                onChange={handleAuthChange}
                required 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            )}
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={authForm.email} 
              onChange={handleAuthChange}
              required 
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={authForm.password} 
              onChange={handleAuthChange}
              required 
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            
            <button 
              type="submit" 
              className="btn-upload" 
              disabled={loading}
              style={{ padding: '12px', fontSize: '16px', fontWeight: 'bold' }}
            >
              {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }} 
              style={{ color: '#0070f3', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isLoginMode ? 'Register here' : 'Login here'}
            </span>
          </p>
        </main>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // Render Main App View if logged in
  // ------------------------------------------------------------------------
  return (
    <div className="container">
      <header className="header" style={{ position: 'relative' }}>
        <h1>Travel Memory App</h1>
        <p>Upload and share your favorite travel moments</p>
        <button 
          onClick={logout} 
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout ({user?.username})
        </button>
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
