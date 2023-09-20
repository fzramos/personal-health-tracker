import axios from 'axios';
import { createContext, useState } from 'react';

const WeightContext = createContext();

export const WeightContextProvider = ({ children }) => {
  const getWeightRecords = () => {
    axios
      .get('/api/weight', { withCredentials: true })
      .then((res) => setWeightRecords(res.data));
  };

  const [weightRecords, setWeightRecords] = useState(
    async () => await getWeightRecords()
  );

  const refreshWeightRecords = async () => {
    const data = await getWeightRecords();
    setWeightRecords(data);
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
