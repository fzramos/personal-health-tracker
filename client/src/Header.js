import React from 'react';
import Popup from './Popup';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

function Header() {
  // useState will returns a variable and a function to change that variable (or just use setState)
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popup_type, setPopupType] = useState();
  // TODO: Automatically set this state to true if user is not signed already

  const openPopup = (popup_type) => {
    setIsPopupOpen(true);
    setPopupType(popup_type);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType();
  };

  // shouldn't do this to reveal popup, need STATES
  // easiest to implement via CLASS
  // const handleSignIn = () => {
  //   console.log('signing in');
  //   return <Popup />;
  // };

  return (
    <Row>
      <Button variant="primary" onClick={() => openPopup('login')}>
        Sign In
      </Button>
      <button
        className="btn btn-secondary"
        onClick={() => openPopup('register')}
      >
        Create New Account
      </button>
      {isPopupOpen && <Popup onClose={closePopup} popup_type={popup_type} />}
    </Row>
  );
}

export default Header;
