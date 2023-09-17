import React from 'react';
import './Popup.css';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

// const handleFormSubmit = (e) => {
//   e.preventDefault();
//   // console.log(e.target);
//   // can get the form element values multipe ways
//   // 1. via array value
//   // e.target[0].value
//   // 2. via name attribute
//   // e.target.elements.username.value OR e.target.usernam.value
//   console.log(`user ${e.target.username.value} attempted to sign-in`);
// };

// const Popup = ({ onClose }) => {
//   // TODO: Intelligently determine if popup wil include
//   // Loginform or RegistrationForm based on the button clicked
//   // STATE

//   return (
//     <div className="popup-container">
//       <div className="popup">
//         <LoginForm />
//         <button onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

// converting into class to better handle states and rendering
// Now trying to have a state that determines which popup the component renders
class Popup extends React.Component {
  // Maybe the input for this component
  // should be onClose AND a prop to define
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      popup_type: this.props.popup_type,
    };
    this.set_popup_type = this.set_popup_type.bind(this);
  }

  set_popup_type(popup_type) {
    this.setState({
      popup_type: popup_type,
    });
  }

  render() {
    console.log(this.state.popup_type);
    let popup_typeComponent;
    if (this.state.popup_type === 'login') {
      popup_typeComponent = (
        <LoginForm set_popup_type={this.props.set_popup_type} />
      );
      // } else if (this.state.popup_type === 'register') {
    } else {
      popup_typeComponent = (
        <RegistrationForm set_popup_type={this.props.set_popup_type} />
      );
    }
    return (
      <div className="popup-container" data-bs-theme="light">
        <div className="popup">
          {popup_typeComponent}
          {/* <LoginForm set_popup_type={this.props.set_popup_type} /> */}
          <button onClick={this.props.onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    );
  }
}

export default Popup;
