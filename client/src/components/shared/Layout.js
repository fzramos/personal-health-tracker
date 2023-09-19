import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useContext, useState } from 'react';
import React from 'react';
import Popup from '../../Popup';
import AuthContext from './AuthContext';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  // useState will returns a variable and a function to change that variable (or just use setState)
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popup_type, setPopupType] = useState();
  const { user, logout } = useContext(AuthContext);

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
            {user && (
              <Nav.Link as={Link} to="/weight">
                Weight
              </Nav.Link>
            )}
          </Nav>
          <Nav className="login-register">
            {user && (
              <>
                <Nav.Link>{user?.email_or_username}</Nav.Link>
                <Nav.Link onClick={async () => await logout()}>Logout</Nav.Link>
                {/* If logout clicked, flash a quick message saying LOGGED OUT */}
              </>
            )}
            {!user && (
              <>
                <Nav.Link onClick={() => openPopup('register')}>
                  <span className="glyphicon glyphicon-user"></span> Sign Up
                </Nav.Link>
                <Nav.Link onClick={() => openPopup('login')}>
                  <span className="glyphicon glyphicon-user"></span> Login
                </Nav.Link>
              </>
            )}
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
