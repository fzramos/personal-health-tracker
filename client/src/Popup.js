import React from 'react';
import './Popup.css';

const Popup = ({ onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        <h2>Sign in</h2>
        <p>Sign in form will go here</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
