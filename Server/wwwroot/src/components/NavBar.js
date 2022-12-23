import React, {useContext} from 'react';
import {Context} from "../index"
import {REGISTRATION_ROUTE} from "../utils/consts";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from "react-router-dom";
import { Button } from 'react-bootstrap';
import {observer} from "mobx-react-lite";

const NavBar = observer( () => {
    const {user} = useContext(Context)
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
            <NavLink style={{color:"White"}} to={REGISTRATION_ROUTE}>Selfiegram</NavLink>
            {user.isAuth ?
                <Nav className="ms-auto" style={{color:'White'}}>
                    <Button variant={"outline-light"} onClick={() => user.setIsAuth(false)}>Выйти</Button>
                </Nav>
                :
                <Nav className="ms-auto" style={{color:'White'}}>
                    <Button variant={"outline-light"} onClick={() => user.setIsAuth(true)}>Регистрация</Button>
                </Nav>
            }
            </Container>
        </Navbar>
    );
});

  export default NavBar;