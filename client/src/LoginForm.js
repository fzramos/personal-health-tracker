import React from 'react';
import Alert from './Alert';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailOrUsername: '',
      password: '',
      alertMessage: '',
    };
    // need to bind the below 2 class function to class instances
    // ES6 class constructor requirement for "extends React.Components"
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setAlertMessage = this.setAlertMessage.bind(this);
  }
  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    }); // setting state of form instance to include username/password values on input chagne
  }
  handleSubmit(event) {
    event.preventDefault();
    // reset the alertMessage to empty
    this.setAlertMessage();
    // try to sign in user with the given details
    console.log(`User ${this.state.emailOrUsername} is trying to sign-in`);
    // TODO: API sign in call goes here
    // if sign in  fails (catch) then update state of alertMessage
    const error_message = 'Username and/or password are invalid';
    this.setAlertMessage(error_message);
    // NOTE: this is not a set state, it calls a function that will setState
  }

  setAlertMessage(message) {
    this.setState({ alertMessage: message });
  }

  render() {
    return (
      <div>
        <Alert message={this.state.alertMessage} />
        <form onSubmit={this.handleSubmit}>
          <label>
            Email or username
            <input
              type="text"
              name="emailOrUsername"
              value={this.state.emailOrUsername}
              onChange={this.handleInputChange}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </label>
          <button type="submit">Log In</button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
