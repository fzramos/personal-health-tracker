import React from 'react';
import Alert from './Alert';
import axios from 'axios';

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

  async handleSubmit(event) {
    event.preventDefault();
    // reset the alertMessage to empty
    this.setAlertMessage();
    // try to sign in user with the given details
    console.log(`User ${this.state.emailOrUsername} is trying to sign-in`);
    // TODO: API sign in call goes here
    try {
      const res = await axios.post('/api/signin', {
        name: this.state.emailOrUsername,
        password: this.state.password,
      });
      console.log(res);
      console.log(res.status);
      //   if (res.status === 400) {
      //     console.log(res.text);
      //     const error_message = 'Username and/or password are invalid';
      //     this.setAlertMessage(error_message);
      //   }
    } catch (error) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      //   const error_message = 'Username and/or password are invalid';
      const error_message = error.response.data;
      this.setAlertMessage(error_message);
    }
    // if sign in  fails (catch) then update state of alertMessage
    // const error_message = 'Username and/or password are invalid';
    // this.setAlertMessage(error_message);
    // NOTE: this is not a set state, it calls a function that will setState
  }

  setAlertMessage(message) {
    this.setState({ alertMessage: message });
  }

  // add button to change this to REGISTRATIONFORM
  // which will be a state in Popup
  render() {
    return (
      <div>
        <Alert message={this.state.alertMessage} />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="loginUsername">Email or username</label>
            <input
              type="text"
              className="form-control"
              name="emailOrUsername"
              id="loginUsername"
              placeholder="Email or username"
              value={this.state.emailOrUsername}
              onChange={this.handleInputChange}
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
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Log-in
          </button>
        </form>
      </div>
    );
  }
}

export default LoginForm;

// <form onSubmit={this.handleSubmit}>
//   <label>
//     Email or username
//     <input
//       type="text"
//       name="emailOrUsername"
//       value={this.state.emailOrUsername}
//       onChange={this.handleInputChange}
//     />
//   </label>
//   <label>
//     Password
//     <input
//       type="password"
//       name="password"
//       value={this.state.password}
//       onChange={this.handleInputChange}
//     />
//   </label>
//   <button type="submit">Log In</button>
// </form>
