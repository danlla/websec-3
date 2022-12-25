import React, {useContext} from 'react';
import {Context} from "../index"
import {REGISTRATION_ROUTE, NEWSFEED_ROUTE, SUBS_ROUTE, PROFILE_ROUTE,SUB_POSTS_ROUTE} from "../utils/consts";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import {observer} from "mobx-react-lite";

const NavBar = observer( () => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
            <NavLink style={{color:"White"}} to={REGISTRATION_ROUTE} onClick={() => {user.setIsAuth(false)}}>Selfiegram</NavLink>
            {user.isAuth ?
                <Nav className="ml-auto" style={{color:'White'}}>
                    <Button className="m-2" variant={"outline-light"} onClick={() => navigate(PROFILE_ROUTE)}>Профиль</Button>
                    <Button className="m-2" variant={"outline-light"} onClick={() => navigate(SUBS_ROUTE)}>Подписки</Button>
                    <Button className="m-2" variant={"outline-light"} onClick={() => navigate(NEWSFEED_ROUTE)}>Рекомендации</Button>
                    <Button className="m-2" variant={"outline-light"} onClick={() => navigate(SUB_POSTS_ROUTE)}>Посты подписок</Button>

                    <Button className="m-2" variant={"outline-light"} onClick={() => {user.setIsAuth(false); user.setToken("")}}>Выйти</Button>
                </Nav>
                :
                <Nav className="ms-auto" style={{color:'White'}}>
                    <Button className="m-2" variant={"outline-light"} onClick={() => navigate(REGISTRATION_ROUTE)}>Регистрация</Button>
                </Nav>
            }
            </Container>
        </Navbar>
    );
});

export default NavBar;