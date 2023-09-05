import React from 'react';
import './Popup.css';
import LoginForm from './LoginForm';

// const handleFormSubmit = (e) => {
//   e.preventDefault();
//   // console.log(e.target);
//   // can get the form element values multipe ways
//   // 1. via array value
//   // e.target[0].value
//   // 2. via name attribute
//   // e.target.elements.username.value OR e.target.usernam.value
//   console.log(`user ${e.target.username.value} attempted to sign-in`);
// };

const Popup = ({ onClose }) => {
  // const [errorMessages, setErrorMessages] = useState({});
  // const [isSubmitted, setIsSubmitted] = useState(false);
  // // Generate JSX code for error messages
  // const renderErrorMessage = (name) => {
  //   name === errorMessages.name && (
  //     <div className="error">{errorMessages.message}</div>
  //   );
  // };

  return (
    <div className="popup-container">
      <div className="popup">
        <LoginForm />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
