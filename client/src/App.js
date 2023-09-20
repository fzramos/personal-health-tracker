import './App.css';
import Layout from './components/shared/Layout';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Weight from './pages/Weight';
import { AuthContextProvider } from './components/shared/AuthContext';

function App() {
  return (
    <>
      {/* If Logged In, home should redirect to /weight */}
      <AuthContextProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/weight" element={<Weight />}></Route>
          </Routes>
        </Layout>
      </AuthContextProvider>
    </>
  );
}

export default App;
