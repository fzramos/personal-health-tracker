import './App.css';
import axios from 'axios';
import Layout from './components/shared/Layout';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

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
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </Layout>
    </>
  );
}

export default App;
