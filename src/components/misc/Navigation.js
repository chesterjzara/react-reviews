import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from "react-router-bootstrap";

// React-Bootstrap Components
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import NavItem from 'react-bootstrap/NavItem';

class Navigation extends Component {
    render() {
        return (
            <Navbar bg="light" expand="md" sticky="top">
                <Navbar.Brand> 
                    <Link to='/'> <h2> Friendly Reviews </h2></Link> 
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {this.props.loginUser.user_id ?
                        <React.Fragment >
                            < LinkContainer to='/friends'>
                                < Nav.Link > Friends </ Nav.Link>
                            </LinkContainer>
                            < LinkContainer to='/places'>
                                < Nav.Link > Places </ Nav.Link>
                            </LinkContainer>
                            < LinkContainer to='/about'>
                                < Nav.Link > About </ Nav.Link>
                            </LinkContainer>
                            {/* <NavDropdown title="Quick Actions" id="basic-nav-dropdown">
                                <LinkContainer to="/map">
                                    <NavDropdown.Item >Add New Place</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/friends/search">
                                    <NavDropdown.Item >Find Friends</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown> */}
                            < LinkContainer to='/' onClick={this.props.handleLogOut}>
                                < Nav.Link > Logout </ Nav.Link>
                            </LinkContainer>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <LinkContainer to='/users'>
                                < Nav.Link > Sign Up / Login </Nav.Link>
                            </LinkContainer>
                            < LinkContainer to='/about'>
                                < Nav.Link > About </ Nav.Link>
                            </LinkContainer>
                        </React.Fragment>
                        
                        }
                        
                        {/* < NavItem > user: {this.props.loginUser.user_id} </NavItem> */}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
  }
  export default Navigation;