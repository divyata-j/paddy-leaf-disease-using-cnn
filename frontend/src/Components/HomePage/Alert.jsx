import React from 'react';

const Alert = ({ message, onClose, imageSrc}) => {
  return (
    <div className="alert-container">
      {imageSrc && <img src={imageSrc} alt="Alert Icon" className="alert-image" />}
      <p className="alert-message">{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Alert;
