import Button from 'react-bootstrap/Button';
import axios from 'axios';
import WeightForm from '../components/shared/WeightForm';
import WeightTable from '../components/shared/WeightTable';
import WeightCharts from '../components/shared/WeightCharts';

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
      <Button variant="primary" onClick={hitBackend}>
        Send request
      </Button>
      <WeightForm></WeightForm>
      <WeightCharts></WeightCharts>
      {/* <WeightTable></WeightTable> */}
    </>
  );
}
