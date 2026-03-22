import React, { useState } from "react";

// TODO: The backend API URL is http://localhost:3000/api
const API_URL = "http://localhost:3000/api";

function Upload({ images, setImages, logout, token }) {
  // TODO: Add `file` (single file object or null), `loading` (boolean), `error` (string or null), and `success` (string).
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    // TODO: Listen for the file input change and update the `file` state.
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    setLoading(true);
    e.preventDefault();
    // TODO: Build the image upload logic:
    // 1. Validate a file exists.
    if (file != null) {
      // 2. Use `new FormData()` and append the single file under the key 'image'.
      const formData = new FormData();
      formData.append("image", file);
      // 3. Send a POST request to `/api/images/upload`.
      await axios
        .post(API_URL + "/images/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        // 4. Important: The response contains the saved image object. Prepend it directly
        //    into your `images` array (using the `setImages` prop) so it renders instantly!
        // 5. Remember to attach your JWT token in the Authorization header so the backend knows who you are!
        .then((response) => {
          setImages([...images, response.data]);
          setSuccess("success upload");
          setLoading(false);
        })
        // 6. If returning a 401 error, call `logout()`.
        .catch((err) => {
          setError(err);
          if (err.response.status === 401) {
            logout();
          }
          setLoading(false);
        });
    }

    return (
      <section className="upload-section">
        {/* TODO: conditionally render `error` or `success` messages */}
        <div>
          {error ? (
            <div className="message error">{error}</div>
          ) : (
            <div className="message success">{success}</div>
          )}
        </div>
        <form className="upload-form" onSubmit={handleUpload}>
          <div className="file-input-wrapper">
            <label htmlFor="file-upload" className="file-input-label">
              {/* TODO: Change this prompt if `file` already exists in state. 
                Example: {file ? 'Click to change file' : 'Click to select...'} */}
              <div>
                {file
                  ? "Click to change file"
                  : "Click to select an image or drag and drop"}
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              className="file-input"
              accept="image/*"
              onChange={handleFileChange}
            />
            {/* TODO: If `file` exists, clearly render its name here */}
            <div>{file && file.name}</div>
          </div>
          <button
            type="submit"
            className="btn-upload"
            disabled={loading} /* TODO: Disable if loading or file is absent */
          >
            Upload Image
          </button>
        </form>
      </section>
    );
  };
}
export default Upload;
