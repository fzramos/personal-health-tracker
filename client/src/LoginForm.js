import React from 'react';
import { useState } from 'react';
import Alert from './Alert';
import AuthContext from './components/shared/AuthContext';

const LoginForm = (props) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState();
  const { close_popup } = props;

  const { login } = React.useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlertMessage();
    try {
      const payload = {
        name: emailOrUsername,
        password: password,
      };
      await login(payload);
      close_popup();
    } catch (error) {
      const error_message = error.response.data;
      setAlertMessage(error_message);
    }
  };

  return (
    <div>
      <Alert message={alertMessage} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="loginUsername">Email or username</label>
          <input
            type="text"
            className="form-control"
            name="emailOrUsername"
            id="loginUsername"
            placeholder="Email or username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="loginPassword">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="loginPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Log-in
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
