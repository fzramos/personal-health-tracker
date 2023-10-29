import axios from 'axios';

const api = axios.create();

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // if the error is a 401 error, redirect the user to the logout route
    if (error.response.status === 401) {
      document.querySelector('#logout').click();
    }
    // TODO: Pressing button so that the AuthContext state is updated
    // is there a way to call the AuthContext logout function from a React interceptor?
    return Promise.reject(error);
  }
);

export const getWeightRecords = async () => {
  const res = await api.get('/api/weight', { withCredentials: true });
  return res.data;
};

export const postWeightRecord = async (payload) => {
  await api.post('/api/weight', payload, { withCredentials: true });

  // const weightEntryObj = _.pick(req.body, [
  //   'weight',
  //   'unit',
  //   'subject',
  //   'weightDate',
  //   'note',
  // ]);
};

export default api;
