import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

// TODO: The backend API URL is http://localhost:3000/api
const API_URL = 'http://localhost:3000/api';

function App() {
  // TODO: Add state variables for `images` (array), `file` (single file object or null),
  // `loading` (boolean), `error` (string or null), and `success` (string or null).

  // TODO: Add auth state variables for `token` (string from localStorage),
  // `user` (object from localStorage), and `isLoginMode` (boolean, defaults to true)
  
  // TODO: Add a single state variable `authForm` to manage the username, email, and password inputs simultaneously.

  // TODO: Set up an Axios interceptor inside a useEffect hook. Every time the `token` variable changes, 
  // configure axios to inject `Authorization: Bearer <token>` into the request headers.

  // TODO: In a useEffect hook, check if there is a `token`. If so, invoke `fetchImages()`.

  const fetchImages = async () => {
    // TODO: Write an async function that sends a GET request to `/api/images`.
    // Store the returned array of images into your `images` state.
    // If you receive a 401 status code (Unauthorized), invoke the `logout()` function.
  };

  const handleAuthChange = (e) => {
    // TODO: Write a function to update the `authForm` state whenever an input field changes.
    // Hint: Use the `name` attribute of the input element directly.
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    // TODO: Send either a POST to `/api/auth/login` or `/api/auth/register` depending on `isLoginMode`.
    // On success:
    // 1. Save the returned token and user object to localStorage.
    // 2. Update the `token` and `user` state variables.
    // 3. Clear the `authForm` state.
    // On failure: catch the error and update the `error` state.
  };

  const logout = () => {
    // TODO: Implement logout. Clear `localStorage`, nullify `token` and `user` states, and empty the `images` array.
  };

  const handleFileChange = (e) => {
    // TODO: Listen for the file input change and update the `file` state.
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    // TODO: Build the image upload logic:
    // 1. Validate a file exists.
    // 2. Use `new FormData()` and append the single file under the key 'image'.
    // 3. Send a POST request to `/api/images/upload`.
    // 4. Important: The response contains the saved image object. Prepend it directly 
    //    into your `images` state array so it renders instantly!
  };

  // ------------------------------------------------------------------------
  // Render Auth View if not logged in
  // ------------------------------------------------------------------------
  
  // TODO: Use a conditional statement here. If there is NO token, return the Login/Register JSX block below.
  // Otherwise, skip this block and return the actual Travel Memory App view.

  // ************************** Login / Register View **************************
  return (
    <div className="container">
      <header className="header">
        <h1>Travel Memory App</h1>
        <p>Login to upload and share your favorite travel moments</p>
      </header>

      <main className="auth-container" style={{ maxWidth: '400px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {/* TODO: Change the h2 text to match whether we are in Login or Register mode dynamically */}
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome Back</h2>
        
        {/* TODO: If there is an error, render it conditionally here inside a div with className="message error" */}

        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* TODO: Render this `username` input ONLY if `isLoginMode` is false */}
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={''} /* TODO: Bind this value to the state */
            onChange={handleAuthChange}
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={''} /* TODO: Bind this value to the state */
            onChange={handleAuthChange}
            required 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={''} /* TODO: Bind this value to the state */
            onChange={handleAuthChange}
            required 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          
          <button 
            type="submit" 
            className="btn-upload" 
            disabled={false} /* TODO: Disable this button if `loading` is true */
            style={{ padding: '12px', fontSize: '16px', fontWeight: 'bold' }}
          >
            {/* TODO: Display 'Processing...' if loading, otherwise 'Login' or 'Register' depending on mode */}
            Submit
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          {/* TODO: Conditionally toggle prompt verbage based on mode */}
          <span 
            onClick={() => { /* TODO: Toggle `isLoginMode` state */ }} 
            style={{ color: '#0070f3', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Toggle Login / Register Mode
          </span>
        </p>
      </main>
    </div>
  );

  // ************************** Main App View **************************
  // TODO: Paste the Travel Memory App Return block here, and bind state correctly.
  
  return (
    <div className="container">
      <header className="header" style={{ position: 'relative' }}>
        <h1>Travel Memory App</h1>
        <p>Upload and share your favorite travel moments</p>
        <button 
          onClick={logout} 
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >
          {/* TODO: Render the user's username next to Logout */}
          Logout
        </button>
      </header>

      <main>
        <section className="upload-section">
          {/* TODO: conditionally render `error` or `success` messages */}
          
          <form className="upload-form" onSubmit={handleUpload}>
            <div className="file-input-wrapper">
              <label htmlFor="file-upload" className="file-input-label">
                {/* TODO: Change this prompt if `file` already exists in state */}
                Click to select an image or drag and drop
              </label>
              <input 
                id="file-upload"
                type="file" 
                className="file-input" 
                accept="image/*" 
                onChange={handleFileChange}
              />
              {/* TODO: If `file` exists, clearly render its name here */}
            </div>
            
            <button 
              type="submit" 
              className="btn-upload" 
              disabled={true} /* TODO: Disable if loading or file is absent */
            >
              Upload Image
            </button>
          </form>
        </section>

        <section className="gallery-section">
          <h2>Your Uploads</h2>
          
          {/* TODO: Render an empty state if `images` array is empty. Otherwise, map through the images array and render gallery-items */}
          <div className="empty-state">
              <p>No images yet. Start writing code to fetch and display them!</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
