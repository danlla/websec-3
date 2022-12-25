import React, { useState,useContext, useEffect } from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import { useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import {Card} from "react-bootstrap";
import { POST_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";

const OtherProfile = observer(() => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState();
  const [username, setUsername] = useState('');
  const {user} = useContext(Context)
  const location = useLocation();
  let id = location.state.id;
  const navigate = useNavigate()

  async function subscribe(){
    let res = await fetch(`https://localhost:7061/api/data/subscribe?idSub=${id}`,{method: 'POST', headers:{'Authorization': 'Bearer ' + user.token}})
    if (res.status === 400){
      alert("subscribe already exist")
    }
  }

  async function clicked(id){
    let res = await fetch(`https://localhost:7061/api/data/like_post?idPost=${id}`,{method: 'POST', headers:{'Authorization': 'Bearer ' + user.token}})
    if (res.status === 400){
      alert("likes already exist")
    }
  }

  useEffect(() => {
    fetch(`https://localhost:7061/api/data/other_profile?userId=${id}`,{method: 'GET', headers:{'Authorization': 'Bearer ' + user.token}})
      .then(res => res.json())
      .then(
        (result) => {
          setPosts(result);
        },
        (error) => {
          setError(error);
        }
      )
      fetch(`https://localhost:7061/api/data/other_username?userId=${id}`,{method: 'GET', headers:{'Authorization': 'Bearer ' + user.token}})
      .then(res => res.json())
      .then(
        (result) => {
          setUsername(result);
        },
        (error) => {
          setError(error);
        }
      )
  }, [])
  if (error) {
    return <div>Ошибка: {error.message}</div>;
  } else {
    return (
        <div>
            {username}
            <Button className="m-2" variant={"dark"} onClick={() => {subscribe()}}>Подписаться</Button>
            <ul>
            {posts.map(post => (
            <Card className="p-4">
            <li key={post.id}>
                {post.username} {post.data} 
                <div > 
                {post.timeCreate} 
                <div> 
                    ♥ {post.likesCount}
                </div>
                    <Button className="m-2" variant={"dark"} onClick={() => {clicked(post.postId)}}>♥</Button>
                    <Button className="m-2" variant={"dark"} onClick={() => {navigate(POST_ROUTE,{state: {id: post.postId}})}}>Открыть комментарии</Button>
                </div>
            </li>
            </Card>
            ))}
            
        </ul>
      </div>
    );
  }
});  
  export default OtherProfile;