import React, { useState } from 'react';

// TODO: The backend API URL is http://localhost:3000/api
const API_URL = 'http://localhost:3000/api';

function Register({ setToken, setUser, toggleMode }) {
  // TODO: Add a `authForm` state to manage `username`, `email` and `password` inputs.

  const handleAuthChange = (e) => {
    // TODO: Update the `authForm` state whenever an input field changes.
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    // TODO: Send a POST request to `/api/auth/register`.
    // On success:
    // 1. Save the returned token to localStorage and the returned usermame, _id and email to an object named user on localStorage.
    // 2. Call `setToken` and `setUser` passed from App.jsx to update the global app state.
    // On failure: catch the error and display it to the user.
  };

  return (
    <main className="auth-container" style={{ maxWidth: '400px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
      
      {/* TODO: If there is an error, render it conditionally here inside a div with className="message error" */}

      <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          value={''} /* TODO: Bind this to state */
          onChange={handleAuthChange}
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={''} /* TODO: Bind this to state */
          onChange={handleAuthChange}
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={''} /* TODO: Bind this to state */
          onChange={handleAuthChange}
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        
        <button 
          type="submit" 
          className="btn-upload" 
          disabled={false} /* TODO: Disable if loading */
          style={{ padding: '12px', fontSize: '16px', fontWeight: 'bold' }}
        >
          Register
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Already have an account?{' '}
        <span 
          onClick={toggleMode} 
          style={{ color: '#0070f3', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Login here
        </span>
      </p>
    </main>
  );
}

export default Register;
