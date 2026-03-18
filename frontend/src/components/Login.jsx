import React, { useState } from 'react';
import axios from 'axios'

// TODO: The backend API URL is http://localhost:3000/api
const API_URL = 'http://localhost:3000/api';

function Login({ setToken, setUser, toggleMode }) {
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const [authForm, setAuthForm] = useState({
    'Email Address': '', 
    'Password': ''
  })
  // TODO: Add a `authForm` state to manage `email` and `password` inputs. 

  const handleAuthChange = (e) => {
    const placeholder = e.target.placeholder
    const value = e.target.value
    
    setAuthForm(prevInfo => ({...prevInfo, [placeholder]: value}))
    // TODO: Update the `authForm` state whenever an input field changes.
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    // TODO: Send a POST request to `/api/auth/login`.
    // On success:
    // 1. Save the returned token and user object to localStorage.
    // 2. Call `setToken` and `setUser` passed from App.jsx to update the global app state.
    // On failure: catch the error and display it to the user.
    setIsLoading(true)
    
    try {
    const response = await axios.post('http://localhost:3000/api/auth/login', authForm);

    const {token, user} = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', user)

    setToken(token)
    setUser(user)
  }
    catch(error) {
      console.error('An error occurred:', error.message);
      setError(error)
    }

    setIsLoading(false)
  };

  return (
    <main className="auth-container" style={{ maxWidth: '400px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome Back</h2>

      {error && <div className='message error'>{error.message}</div>}
      {/* TODO: If there is an error, render it conditionally here inside a div with className="message error" */}

      <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={authForm.email} /* TODO: Bind this to state */
          onChange={handleAuthChange}
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={authForm.password} /* TODO: Bind this to state */
          onChange={handleAuthChange}
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        
        <button
          type="submit" 
          className="btn-upload" 
          disabled={isLoading} /* TODO: Disable if loading */
          style={{ padding: '12px', fontSize: '16px', fontWeight: 'bold' }}
        >
          Login
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Don't have an account?{' '}
        <span 
          onClick={toggleMode} 
          style={{ color: '#0070f3', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Register here
        </span>
      </p>
    </main>
  );
}

export default Login;
