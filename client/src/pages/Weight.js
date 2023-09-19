import Button from 'react-bootstrap/Button';
import axios from 'axios';

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
    <div>
      <Button variant="primary" onClick={hitBackend}>
        Send request
      </Button>
    </div>
  );
}
