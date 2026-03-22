import React from "react";

function Gallery({ images }) {
  return (
    <section className="gallery-section">
      <h2>Your Uploads</h2>
      {/* 
        TODO: Check if the `images` array passed via props is empty. 
        CRITICAL: Remember to attach your JWT token in the Authorization header 
        (in your App.jsx fetch request) so the backend knows who you are! 
      */}
      <div>
        {/* If empty, render this empty-state div. */}
        {images.length === 0 ? (
          <div className="empty-state">
            <p>No images yet. Start writing code to fetch and display them!</p>
          </div>
        ) : (
          images.map((img) => (
            <div key={img._id} className="gallery-item">
              {/* If it contains images, map through the array and render a `.gallery-item` for each image. */}
              <div className="image-wrapper">
                <img
                  src={img.s3Url}
                  alt={img.filename}
                  className="gallery-img"
                />
              </div>
              <div className="image-info">
                <p className="image-name">{img.filename}</p>
                {/* TODO: (img.status badge logic goes here)*/}
                <span className={`status-badge ${img.status}`}>
                  {img.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Gallery;
