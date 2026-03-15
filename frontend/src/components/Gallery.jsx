import React from 'react';

function Gallery({ images }) {
  return (
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
  );
}

export default Gallery;
