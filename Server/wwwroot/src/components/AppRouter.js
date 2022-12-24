import React, {useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom'
import {AuthRoutes, PublicRoutes} from "../Routes"
import {REGISTRATION_ROUTE} from "../utils/consts"
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const AppRouter = observer(() => {
    const {user} = useContext(Context)

    console.log(user)
    return (
        <Routes>
            {user.isAuth === true && AuthRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={<Component/>} exact/>
            )}
            {PublicRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={<Component/>} exact/>
            )}
            <Route path='*' element={<Navigate to={REGISTRATION_ROUTE}/>} />
        </Routes>
    );
  });
  
  export default AppRouter;