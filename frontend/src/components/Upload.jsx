import React, { useState } from 'react';
import axios from 'axios';

// The backend API URL is http://localhost:3000/api
const API_URL = 'http://localhost:3000/api';

function Upload({ images, setImages, logout, token }) {
  // `file` (single file object or null), `loading` (boolean), `error` (string or null), and `success` (string).
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    // Listen for the file input change and update the `file` state.
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    // Build the image upload logic:

    // 1. Validate a file exists.
    if (!file) {
      return;
    }

    // 2. Use `new FormData()` and append the single file under the key 'image'.
    const formData = new FormData();
    formData.append("image", file);
    setIsLoading(true);
    setError(null);
    setSuccess('');

    // 3. Send a POST request to `/api/images/upload`.
    // 4. Important: The response contains the saved image object. Prepend it directly 
    //    into your `images` array (using the `setImages` prop) so it renders instantly!
    // 5. Remember to attach your JWT token in the Authorization header so the backend knows who you are!
    try {
      const response = await axios.post(`${API_URL}/images/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess('Uploded the image successfully!');
      setImages([...images, response.data]);
    }

    // 6. If returning a 401 error, call `logout()`.
    catch (error) {
      setError(error.message)
      if (error.response.status == 401) {
        logout();
      }
    }

    setIsLoading(false);
  };

  return (
    <section className="upload-section">
      {/* conditionally render `error` or `success` messages */}
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form className="upload-form" onSubmit={handleUpload}>
        <div className="file-input-wrapper">
          <label htmlFor="file-upload" className="file-input-label">
            {/* Change this prompt if `file` already exists in state. 
                Example: {file ? 'Click to change file' : 'Click to select...'} */}
            {file ? <p>click to change file</p> : <p>click to select an image or drag and drop</p>}
          </label>
          <input
            id="file-upload"
            type="file"
            className="file-input"
            accept="image/*"
            onChange={handleFileChange}
          />
          {/* If `file` exists, clearly render its name here */}
          {file && <p>{file.name}</p>}
        </div>

        <button
          type="submit"
          className="btn-upload"
          disabled={isLoading || !file} /* Disable if loading or file is absent */
        >
          Upload Image
        </button>
      </form>
    </section>
  );
}

export default Upload;
