import axios from 'axios';
import { createContext, useState } from 'react';

const WeightContext = createContext();

export const WeightContextProvider = ({ children }) => {
  const [weightRecords, setWeightRecords] = useState([]);

  const getWeightRecords = () => {
    return axios
      .get('/api/weight', { withCredentials: true })
      .then((res) => setWeightRecords(res.data));
  };

  const refreshWeightRecords = async () => {
    await getWeightRecords();
  };

  return (
    <>
      <WeightContext.Provider value={{ refreshWeightRecords, weightRecords }}>
        {children}
      </WeightContext.Provider>
    </>
  );
};

export default WeightContext;
