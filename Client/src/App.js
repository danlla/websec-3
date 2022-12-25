import React from 'react';
import {BrowserRouter} from  'react-router-dom';
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {Helmet} from "react-helmet";


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Helmet>
                <meta charSet="utf-8" />
                <title>Selfiegram</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
