import React, { useState,useContext, useEffect } from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Card} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { OTHER_USER_PROFILE_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";

const Subs = observer(() => {
  const [subs, setSubs] = useState([]);
  const [error, setError] = useState();
  const {user} = useContext(Context)
  const navigate = useNavigate()

  useEffect(() => {
    fetch("https://localhost:7061/api/data/subs",{method: 'GET', headers:{'Authorization': 'Bearer ' + user.token}})
      .then(res => res.json())
      .then(
        (result) => {
          setSubs(result);
          console.log(result)
        },
        (error) => {
          setError(error);
        }
      )
  }, [])
  if (!subs.length){
    return <Card className="p-4">
      Нет подписок
    </Card>
  }
  if (error) {
    return <div>Ошибка: {error.message}</div>;
  } else {
    return (
      <ul>
        {subs.map(sub => (
          <Card className="p-4">
          <li key={sub.id}>
            {sub.username} 
            <Button className="m-2" variant={"dark"} onClick={() => {navigate(OTHER_USER_PROFILE_ROUTE,{state: {id: sub.userId}})}}>Открыть профиль</Button>
          </li>
          </Card>
        ))}
      </ul>
    );
  }
});  
  export default Subs;