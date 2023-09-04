import React from 'react';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailOrUsername: '',
      password: '',
    };
    // need to bind the below 2 class function to class instances
    // ES6 class constructor requirement for "extends React.Components"
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    console.log(`User ${this.state.emailOrUsername} is trying to sign-in`);
  }

  render() {
    return (
      <div>
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
