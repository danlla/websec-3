import Button from "react-bootstrap/Button";
import React, { useState,useContext } from 'react';
import {Card, Container, Form} from "react-bootstrap";
import { PROFILE_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const AddPost = observer(() => {
  const {user} = useContext(Context)
  const [data, setData] = useState('')
  const navigate = useNavigate()
  

  async function clicked(){ 
      let res = await fetch(`https://localhost:7061/api/data/add_post?data=${data}`, {method: 'POST', headers:{'Authorization': 'Bearer ' + user.token}})
      navigate(PROFILE_ROUTE)
    }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{height: window.innerHeight - 54}}
    >
      <Card style={{width: 600}} className="p-5">
        <Form className="d-flex flex-column"> 
          <Form.Control 
            className="mt-3" 
            placeholder="Введите текст"
            value={data}
            onChange={e => setData(e.target.value)}
          /> 
              <Button variant={"outline-success"} onClick={clicked}>
                Опубликовать
              </Button>
          </Form>
      </Card>
    </Container>
  );
});
  
export default AddPost;