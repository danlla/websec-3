import Button from "react-bootstrap/Button";
import React, { useState } from 'react';
import {Card, Container, Form} from "react-bootstrap";
import { REGISTRATION_ROUTE, LOGIN_ROUTE } from "../utils/consts";
import { NavLink, useLocation } from "react-router-dom";

const Auth = () => {
  const location = useLocation()
  const isLogin = location.pathname === LOGIN_ROUTE
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{height: window.innerHeight - 54}}
    >
      <Card style={{width: 600}} className="p-5">
        <h2 className="m-auto">{isLogin ? 'Вход' : 'Регистрация'}</h2>
        <Form className="d-flex flex-column">
          {isLogin === false && <Form.Control className="mt-3" placeholder="Введите вашу почту"/> }
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш логин"
          />
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш пароль"
          />
          <Form className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {isLogin?
              <div>
                Нет аккаунта? <NavLink to = {REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
              </div>
              :
              <div>
                Есть аккаунт? <NavLink to = {LOGIN_ROUTE}>Войдите!</NavLink>
              </div>
              }
              <Button variant={"outline-success"}>
                {isLogin ? 'Войти' : 'Регистрация'}
              </Button>
          </Form>
        </Form>
      </Card>
    </Container>
  );
};
  
  export default Auth;