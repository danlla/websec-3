import Button from "react-bootstrap/Button";
import React, { useState,useContext, useEffect } from 'react';
import {Card, Container, Form} from "react-bootstrap";
import { REGISTRATION_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from "../utils/consts";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const Profile = observer(() => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState();
  const {user} = useContext(Context)

  useEffect(() => {
    fetch("https://localhost:7061/api/data/profile",{method: 'GET', headers:{'Authorization': 'Bearer ' + user.token}})
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
  }, [])
  if (error) {
    return <div>Ошибка: {error.message}</div>;
  } else {
    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {post.data} {post.timeCreate}
          </li>
        ))}
      </ul>
    );
  }
});  
  export default Profile;