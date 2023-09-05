import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Header from './Header';

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
