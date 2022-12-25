import Button from "react-bootstrap/Button";
import React, { useState,useContext, useEffect } from 'react';
import {Form} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import { useLocation } from "react-router-dom";
import {Card} from "react-bootstrap";

const Post = observer(() => {
  const [comments, setComments] = useState([]);
  const [data, setData] = useState('');
  const [post, setPost] = useState();
  const {user} = useContext(Context)
  const location = useLocation();
  let id = location.state.idPost;
  
  async function clicked(data){
    let res = await fetch(`https://localhost:7061/api/data/comment_post?postId=${id}&data=${data}`,{method: 'POST', headers:{'Authorization': 'Bearer ' + user.token}})
  }

  useEffect(() => {
    setInterval(() => {
      fetch(`https://localhost:7061/api/data/comments?postId=${id}`,{method: 'GET', headers:{'Authorization': 'Bearer ' + user.token}})
    .then(res => res.json())
    .then(
      (result) => {
        setComments(result);
      },
    )
    fetch(`https://localhost:7061/api/data/post?postId=${id}`,{method: 'GET', headers:{'Authorization': 'Bearer ' + user.token}})
    .then(res => res.json())
    .then(
      (result) => {
        setPost(result);
      },
    )
    }, 500)
  }, [])
    return (
        <div>
            {post && <Card className="p-4">
            {post.username} {post.data} 
                <div> 
                {post.timeCreate} 
                    <div> 
                        ♥ {post.likesCount}
                    </div>
                </div>
            </Card>
            }
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