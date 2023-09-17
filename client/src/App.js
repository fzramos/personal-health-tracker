import './App.css';
import axios from 'axios';
import Layout from './components/shared/Layout';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { AuthContextProvider } from './components/shared/AuthContext';

function MainContent() {
  const hitBackend = () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };
    axios.get('/api/weight', config).then((response) => {
      console.log(response.data);
    });
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
      <AuthContextProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </Layout>
        <MainContent>
          {/* quick test that, when log in successful, protected API calls are succesful */}
        </MainContent>
      </AuthContextProvider>
    </>
  );
}

export default App;
