import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Popup from './Popup';
import { useState } from 'react';

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

function MainContent() {
  const hitBackend = () => {
    axios.get('/api/weight').then((response) => {
      console.log(response.data);
    });
    // console.log('hi');
  };
  return (
    <div>
      <button onClick={hitBackend}>Send request</button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Header></Header>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <MainContent />
    </div>
  );
}

export default App;
