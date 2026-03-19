import React, { useState } from 'react';
import axios from 'axios';


// TODO: The backend API URL is http://localhost:3000/api
const API_URL = 'http://localhost:3000/api';

function Login({ setToken, setUser, toggleMode }) {
  // TODO: Add a `authForm` state to manage `email` and `password` inputs.
  const [authForm, setAuthForm] = useState({email:"", password: ""});
  const [errorMsg, setErrorMsg] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthChange = (e) => {
    // TODO: Update the `authForm` state whenever an input field changes.
    console.log(authForm)
    setAuthForm((prev) => {
      return { ...prev, [e.target.name]: e.target.value}
    });

  };

    const handleSubmit= (e) => {
    // TODO: Update the `authForm` state whenever an input field changes.
    e.preventDefault();
    setIsSubmitting(true);

    };

  

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    // TODO: Send a POST request to `/api/auth/login`.
    axios.post('/api/auth/login', {post})
    .then(respose => {
      // const {token} = respose.data;
      localStorage.setItem('token', respose.token);
      setToken(respose.token)
      localStorage.setItem('user', response.user);
      setUser(response.user)

    })
    .catch(err)
    {setErrorMsg(e)}
    if(errorMsg){
      const error = errorMsg
      setErrorMsg(null)
      return <p>{error}</p>
    }

    
     // On success:
    // 1. Save the returned token and user object to localStorage.
    // 2. Call `setToken` and `setUser` passed from App.jsx to update the global app state.
    // On failure: catch the error and display it to the user.


    
  }
    
   
  return (
    <main className="auth-container" style={{ maxWidth: '400px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome Back</h2>
      
      {/* TODO: If there is an error, render it conditionally here inside a div with className="message error" */}

      <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          onChange={handleAuthChange}
          value={authForm.email} /* TODO: Bind this to state */
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleAuthChange}
          value={authForm.password} /* TODO: Bind this to state */
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        
        <button 
          type="submit" 
          className="btn-upload" 
          onClick={handleSubmit}
          disabled={isSubmitting} /* TODO: Disable if loading */
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
  );}


export default Login;
