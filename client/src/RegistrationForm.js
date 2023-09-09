import React from 'react';
import Alert from './Alert';
import axios from 'axios';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      repeat_password: '',
      subjects: [''],
      subjectCount: 1,
      alertMessage: '',
    };
    // need to bind the below 2 class function to class instances
    // ES6 class constructor requirement for "extends React.Components"
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setAlertMessage = this.setAlertMessage.bind(this);
    this.handleSubjectValueChange = this.handleSubjectValueChange.bind(this);
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    }); // setting state of form instance to include username/password values on input chagne
  }

  handleSubjectValueChange(event) {
    event.preventDefault();
    const target = event.target;
    const updatedSubjects = this.state.subjects.map((subject, i) => {
      if (i.toString() === target.id.replace('subject', '')) {
        return target.value;
      } else return subject;
    });
    this.setState({
      subjects: updatedSubjects,
    }); // setting state of form instance to include username/password values on input chagne
  }

  async handleSubmit(event) {
    event.preventDefault();
    // reset the alertMessage to empty
    this.setAlertMessage();
    // try to sign in user with the given details
    console.log(`User ${this.state.email} is trying to register`);
    // TODO: API sign in call goes here
    try {
      const res = await axios.post('/api/user/register', {
        name: this.state.username,
        email: this.state.email,
        password: this.state.password,
        repeat_password: this.state.repeat_password,
        subjects: this.state.subjects.filter((subject) => subject !== ''),
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

  // function MainContent() {
  //   const hitBackend = () => {
  //     axios.get('/api/weight').then((response) => {
  //       console.log(response.data);
  //     });
  //     // console.log('hi');
  //   };
  //   return (
  //     <div>
  //       <button onClick={hitBackend}>Send request</button>
  //     </div>
  //   );
  // }

  setAlertMessage(message) {
    this.setState({ alertMessage: message });
  }

  handleSubjectCountChange(value) {
    // change subject count and
    this.setState({ subjectCount: this.state.subjectCount + value });
    if (this.state.subjectCount === 0) this.setState({ subjectCount: 1 });

    if (value === -1) {
      this.setState({
        subjects: this.state.subjects.slice(0, -1),
      });
    } else {
      this.setState({ subjects: [...this.state.subjects, ''] });
      // this.state.subjects.setState(this.state.subjects.push(''));
    }
  }

  render() {
    // const subjects = this.state.subjects;
    // console.log(typeof subjects);
    return (
      <>
        <div>
          <Alert message={this.state.alertMessage} />
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="registerEmail">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="registerEmail"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={this.state.email}
                onChange={this.handleInputChange}

                //         type="email"
                //         name="email"
                //         value={this.state.email}
                //         onChange={this.handleInputChange}
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="registerUsername">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                id="registerUsername"
                placeholder="Reynolds Family"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="registerPassword">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                id="registerPassword"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="registerPasswordRepeated">Repeat Password</label>
              <input
                type="password"
                className="form-control"
                id="registerPasswordRepeated"
                name="repeat_password"
                placeholder="Repeat Password"
                value={this.state.repeat_password}
                onChange={this.handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="registerUsername">Subjects</label>
              {/* <input
                type="text"
                className="form-control"
                id="subject1"
                key="1"
                placeholder="Frank"
                value={this.state.subjects.subject1}
                onChange={this.handleInputChange}
              /> */}
              {this.state.subjects.map((subject, index) => {
                return (
                  <input
                    type="text"
                    className="form-control"
                    id={`subject${index}`}
                    key={`${index}`}
                    placeholder={`Family member ${index + 1}`}
                    value={this.state.subjects.index}
                    onChange={this.handleSubjectValueChange}
                  />
                );
              })}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.handleSubjectCountChange(1)}
              >
                +
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.handleSubjectCountChange(-1)}
              >
                -
              </button>
            </div>
            {/* <div className="form-check">
    <input type="checkbox" className="form-check-input" id="exampleCheck1">
    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
  </div> */}
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </form>
        </div>
      </>
    );
  }
}

export default RegistrationForm;

// <div>
//   <Alert message={this.state.alertMessage} />
//   <form onSubmit={this.handleSubmit}>
//     <label>
//       Email
//       <input
//         type="email"
//         name="email"
//         value={this.state.email}
//         onChange={this.handleInputChange}
//       />
//     </label>
//     <label>
//       Username
//       <input
//         type="text"
//         name="username"
//         value={this.state.name}
//         onChange={this.handleInputChange}
//       />
//     </label>
//     <label>
//       Password
//       <input
//         type="password"
//         name="password"
//         value={this.state.password}
//         onChange={this.handleInputChange}
//       />
//     </label>
//     <label>
//       Repeat password
//       <input
//         type="password"
//         name="repeat_password"
//         value={this.state.repeat_password}
//         onChange={this.handleInputChange}
//       />
//     </label>
//     <label>
//       People who will use this account
//       {/* TODO: will default to username */}
//       {/* TODO: need to intelligently add text box inputs if user presses PLUS */}
//       <input
//         type="text"
//         name="subjects"
//         value={this.state.subjects}
//         onChange={this.handleInputChange}
//       />
//     </label>
//     <button type="submit">Register</button>
//   </form>
// </div>;
