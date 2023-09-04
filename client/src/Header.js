import React from 'react';
import Popup from './Popup';
// import './Popup.css';

function Header() {
  // useState returns a boolean and a function to change that boolean
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFailedSignin, setIsFailedSignin] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
    setIsFailedSignin(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // can't do this to reveal popup, need STATES
  // const handleSignIn = () => {
  //   console.log('signing in');
  //   return <Popup />;
  // };

  return (
    <div>
      <button onClick={openPopup}>Sign In</button>
      {isPopupOpen && (
        <Popup
          onClose={closePopup}
          isFailedSignin={isFailedSignin}
          setIsFailedSignin
        />
      )}
    </div>
  );
}

// function Header() {
//   const handleSignIn = () => {
//     console.log('signing in');
//     return <Popup />;
//   };
//   return (
//     <div>
//       <button onClick={handleSignIn}>Sign In</button>
//     </div>
//   );
// }
