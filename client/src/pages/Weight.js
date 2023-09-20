import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { WeightContextProvider } from '../components/shared/WeightContext';
import WeightForm from '../components/shared/WeightForm';

export default function Weight(props) {
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
    <>
      <WeightContextProvider>
        {' '}
        <Button variant="primary" onClick={hitBackend}>
          Send request
        </Button>
        <WeightForm></WeightForm>
      </WeightContextProvider>
    </>
  );
}
