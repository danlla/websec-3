import Button from "react-bootstrap/Button";
import React, { useState,useContext, useEffect } from 'react';
import {Form} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import { useLocation } from "react-router-dom";

const Post = observer(() => {
  const [comments, setComments] = useState([]);
  const [data, setData] = useState('');
  const {user} = useContext(Context)
  const location = useLocation();
  console.log(location.state)
  let id = location.state.id;
  
  async function clicked(data){
    let res = await fetch(`https://localhost:7061/api/data/comment_post?postId=${id}&data=${data}`,{method: 'POST', headers:{'Authorization': 'Bearer ' + user.token}})
    if (res.status === 400){
      alert("likes already exist")
    }
  }

  useEffect(() => {
    fetch(`https://localhost:7061/api/data/comments?postId=${id}`,{method: 'GET', headers:{'Authorization': 'Bearer ' + user.token}})
    .then(res => res.json())
    .then(
      (result) => {
        setComments(result);
        console.log(result)
      },
    )
  })
    return (
        <div>
         {comments.length &&
        <ul>
            {comments.map(comment => (
            <li key={comment.id}>
                {comment.username} {comment.data} {comment.timeCreate}
            </li>
            ))}
        </ul>
        }
            <Form.Control
                    className="mt-3"
                    placeholder="Введите комментарий"
                    value={data}
                    onChange={e => setData(e.target.value)}
                />
            <Button className="m-2" variant={"dark"} onClick={() => {clicked(data)}}>Добавить комментарий</Button>
      </div>
    );
});  
  export default Post;