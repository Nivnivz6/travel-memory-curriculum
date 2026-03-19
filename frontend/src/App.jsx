import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Upload from './components/Upload';
import Gallery from './components/Gallery';
import './index.css';

// The backend API URL is http://localhost:3000/api
const API_URL = 'http://localhost:3000/api';

function App() {
  // state variables for `images` (array).
  const [images, setImages] = useState([]);

  // auth state variables for `token` (string from localStorage),
  // `user` (object from localStorage), and `isLoginMode` (boolean, defaults to true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [isLoginMode, setIsLoginMode] = useState(true)

  // (useEffect): React uses the `useEffect` hook to run side effects (like fetching data from an API) 
  // outside the normal rendering cycle. 
  // Create a `useEffect` hook that listens to the `token` state variable in its dependency array.
  // Inside the hook, check if a `token` exists. If it does, invoke your `fetchImages()` function!
  useEffect(() => {
    if (token) {
      fetchImages();
    }
  }, [token]);

  const fetchImages = async () => {
    // An async function that sends a GET request to `/api/images`.
    // CRITICAL (Data Isolation): When fetching images, the backend MUST know exactly who is asking
    // so it doesn't accidentally return another user's private photos!
    // Therefore, you MUST configure Axios here to inject the `Authorization: Bearer <token>` 
    // header into this GET request.
    // Store the returned array of images into your `images` state.
    // If you receive a 401 status code (Unauthorized), invoke the `logout()` function.
    const response = await axios.get(`${API_URL}/images`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });

    if (response.ok) {
      setImages(response.data)
      return
    }

    if (response.status == 401) {
        logout();
      }
    };

  const logout = () => {
    // Implement logout. Clear `localStorage`, nullify `token` and `user` states, and empty the `images` array.
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setImages([])
  };

  const toggleMode = () => {
    // Write a small function to toggle the boolean `isLoginMode`
    setIsLoginMode(!isLoginMode)
  };

  // ------------------------------------------------------------------------
  // Render Auth View if not logged in
  // ------------------------------------------------------------------------

  // Use a conditional statement here. If there is NO token, return the Login/Register JSX block below.
  // Otherwise, skip this block and return the actual Travel Memory App view.

  if (!token) {
    // ************************** Login / Register View **************************
    // Conditionally render the `<Login />` component or the `<Register />` component
    // based on `isLoginMode`. 
    // Don't forget to pass the `setToken`, `setUser`, and `toggleMode` props!
    return (
      <div className="container">
        <header className="header">
          <h1>Travel Memory App</h1>
          <p>Login to upload and share your favorite travel moments</p>
        </header>

        {/* If isLoginMode is true, render <Login />, otherwise <Register /> */}
        {isLoginMode ?
          (
            <Login
              setToken={() => {setToken}}
              setUser={() => {setUser}}
              toggleMode={toggleMode}
            />
          ) : (
            <Register
              setToken={() => {setToken}}
              setUser={() => {setUser}}
              toggleMode={toggleMode}
            />
          )}
      </div>
    );
  }


  // ************************** Main App View **************************
  // Paste the Travel Memory App Return block here, and bind state correctly.

  return (
    <div className="container">
      <header className="header" style={{ position: 'relative' }}>
        <h1>Travel Memory App</h1>
        <p>Upload and share your favorite travel moments</p>
        <button
          onClick={logout}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >
          {/* Render the user's username next to Logout */}
          Logout {user.username}
        </button>
      </header>

      <main>
        {/* Render the <Upload /> component and pass down `images`, `setImages`, `logout`, and `token` as props */}
        <Upload token={token} images={images} setImages={() => {setImages}} logout={logout} />

        {/* Render the <Gallery /> component and pass down `images` as a prop */}
        <Gallery images={images} />
      </main>
    </div>
  );
}

export default App;
