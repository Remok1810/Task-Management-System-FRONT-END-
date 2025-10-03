import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../services/Auth'

function AppNavbar(props) {
  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Navbar.Brand as={Link} to="/">Kaleesh</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {!isAuthenticated() && <Nav.Link as={Link} to="/register">Register</Nav.Link>}
          {!isAuthenticated() && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
          {isAuthenticated() && <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>}
          {isAuthenticated() && (
            <Nav.Link as="button" onClick={props.logOutUser} style={{ background: 'none', border: 'none' }}>
              Logout
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default AppNavbar
