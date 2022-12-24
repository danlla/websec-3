import React, { useState,useContext, useEffect } from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import Button from "react-bootstrap/Button";
import {Card} from "react-bootstrap";
import { POST_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";

const NewsFeed = observer(() => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState();
  const {user} = useContext(Context)
  const navigate = useNavigate()

  async function clicked(id){
    let res = await fetch(`https://localhost:7061/api/data/like_post?idPost=${id}`,{method: 'POST', headers:{'Authorization': 'Bearer ' + user.token}})
    console.log(res)
    if (res.status === 400){
      alert("likes already exist")
    }
  }

  useEffect(() => {
    fetch("https://localhost:7061/api/data/random_post",{method: 'GET', headers:{'Authorization': 'Bearer ' + user.token}})
      .then(res => res.json())
      .then(
        (result) => {
          setPosts(result);
          console.log(result)
        },
        (error) => {
          setError(error);
        }
      )
  })
  if (error) {
    return <div>Ошибка: {error.message}</div>;
  } else {
    return ( 
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
      
    );
  }
});  
  export default NewsFeed;