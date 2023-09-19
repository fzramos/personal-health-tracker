import axios from 'axios';
import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    let userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      return JSON.parse(userProfile);
    }
    return null;
  });
  const navigate = useNavigate();
  const login = async (payload) => {
    const res = await axios.post('/api/signin', payload);
    localStorage.setItem('userProfile', JSON.stringify(res.data.user));
    setUser(res.data.user);
    navigate('/weight');
  };
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };
  const logout = async () => {
    await axios.post('/api/logout', {}, config);
    // delete item in localStorage?
    localStorage.setItem('userProfile', '');
    setUser();
    navigate('/');
  };

  return (
    <>
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthContext;
