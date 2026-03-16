import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Upload from './components/Upload';
import Gallery from './components/Gallery';
import './index.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [images, setImages] = useState([]);
  
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Fetch images when token changes
  useEffect(() => {
    if (token) {
      fetchImages();
    }
  }, [token]);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/images`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImages(res.data);
    } catch (err) {
      console.error('Failed to fetch images:', err);
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setImages([]);
  };

  const toggleMode = () => setIsLoginMode(!isLoginMode);

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

        {isLoginMode ? (
          <Login setToken={setToken} setUser={setUser} toggleMode={toggleMode} />
        ) : (
          <Register setToken={setToken} setUser={setUser} toggleMode={toggleMode} />
        )}
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
        <Upload images={images} setImages={setImages} logout={logout} token={token} />
        <Gallery images={images} />
      </main>
    </div>
  );
}

export default App;
