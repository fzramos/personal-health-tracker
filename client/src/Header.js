import React from 'react';
import Popup from './Popup';
import { useState } from 'react';

function Header() {
  // useState will returns a variable and a function to change that variable (or just use setState)
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // shouldn't do this to reveal popup, need STATES
  // easiest to implement via CLASS
  // const handleSignIn = () => {
  //   console.log('signing in');
  //   return <Popup />;
  // };

  return (
    <div>
      <button onClick={openPopup}>Sign In</button>
      {isPopupOpen && <Popup onClose={closePopup} />}
    </div>
  );
}

export default Header;
