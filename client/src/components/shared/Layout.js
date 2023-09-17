import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import Header from '../../Header';
import React from 'react';
import Popup from '../../Popup';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';

const Layout = ({ children }) => {
  // useState will returns a variable and a function to change that variable (or just use setState)
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popup_type, setPopupType] = useState();
  // TODO: Automatically set this state to true if user is not signed already

  const openPopup = (popup_type) => {
    setIsPopupOpen(true);
    setPopupType(popup_type);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType();
  };

  return (
    <>
      <Navbar className="bd-navbar">
        <Container variant="fluid">
          <Navbar variant="header">
            <Navbar variant="brand">Health App</Navbar>
          </Navbar>
          <Nav>
            <Nav.Link href="#">Home</Nav.Link>
          </Nav>
          <Nav className="login-register">
            <Nav.Link onClick={() => openPopup('register')}>
              <span className="glyphicon glyphicon-user"></span> Sign Up
            </Nav.Link>
            <Nav.Link onClick={() => openPopup('login')}>
              <span className="glyphicon glyphicon-user"></span> Login
            </Nav.Link>
            {/* <Nav.Item>
              <Button variant="primary" onClick={() => openPopup('login')}>
                Sign In
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button variant="secondary" onClick={() => openPopup('register')}>
                Create New Account
              </Button>
            </Nav.Item> */}
            {isPopupOpen && (
              <Popup onClose={closePopup} popup_type={popup_type} />
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container>{children}</Container>
    </>
  );
};

export default Layout;
