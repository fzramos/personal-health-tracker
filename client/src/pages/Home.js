import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

const Home = () => {
  return (
    <>
      <div className="App">
        <div
          className="d-flex justify-content-center align-items-center text-light bg-dark"
          style={{ minHeight: '500px', minWidth: '600px' }}
        >
          <Card>
            <Card.Body>
              <Card.Text>
                Welcome to demo on ReactJS (v18) Jwt Authentication with HTTP
                Only cookie
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
      </div>
    </>
  );
};

export default Home;