import Button from "react-bootstrap/Button";
import React, { useState,useContext } from 'react';
import {Card, Container, Form} from "react-bootstrap";
import { REGISTRATION_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from "../utils/consts";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const Auth = observer(() => {
  const {user} = useContext(Context)
  const location = useLocation()
  const navigate = useNavigate()
  const isLogin = location.pathname === LOGIN_ROUTE
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const flag = false

  async function confirm(){
      let res = await fetch(`https://localhost:7061/send?username=${username}&code=${code}`,{method: 'POST'})
      if (res.status === 400){
        setError("Неверный код")
      }
      if (res.status === 200){
        setError("Регистрация прошла успешно")
      }
  }

  async function clicked(){
    if (isLogin) {
      let res = await fetch(`https://localhost:7061/login?username=${username}&password=${password}`,{method: 'POST'})
      if (res.status === 404){
        setError("Логин не существует")
        return
      }
      if (res.status === 400){
        setError("Неверный пароль")
        return
      }
      let token = await res.text()
      user.setToken(token)
      user.setIsAuth(true)
      navigate(PROFILE_ROUTE)
    }
    else {
      let res = await fetch(`https://localhost:7061/register?email=${email}&username=${username}&password=${password}`,{method: 'POST'}) 
      if (res.status === 400){
        setError("Пользователь уже зарегистрирован или проблемы с почтой")
      }
      flag = true
    }
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{height: window.innerHeight - 54}}
    >
      <Card style={{width: 600}} className="p-5">
        <h2 className="m-auto">{isLogin ? 'Вход' : 'Регистрация'}</h2>
        <Form className="d-flex flex-column">
          {isLogin === false && 
          <Form.Control 
            className="mt-3" 
            placeholder="Введите вашу почту"
            value={email}
            onChange={e => setEmail(e.target.value)}

          /> }
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш логин"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {isLogin === false && 
          <Form.Control 
            className="mt-3" 
            placeholder="После того, как нажмёте регистрация, введите сюда код, пришедший на почту"
            value={code}
            onChange={e => setCode(e.target.value)}

          /> }
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

              <Button variant={"outline-success"} onClick={clicked}>
                {isLogin ? 'Войти' : 'Регистрация'}
              </Button>
              {isLogin === false &&
                <Button variant={"outline-success"} onClick={confirm}>
                  Проверить
                </Button>
              }
          </Form>
          <div className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {error}
          </div>
          </Form>
      </Card>
    </Container>
  );
});
  
export default Auth;