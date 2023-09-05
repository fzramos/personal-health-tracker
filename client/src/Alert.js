import React from 'react';

class Alert extends React.Component {
  // don't need the constructor if only super is being called
  //   constructor(props) {
  //     super(props);
  //   }

  render() {
    if (!this.props.message) return '';
    return <div id="failedSignInTxt">{this.props.message}</div>;
  }
}

export default Alert;
