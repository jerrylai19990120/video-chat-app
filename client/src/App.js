import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./components/Home";
import Room from "./components/Room";
import Login from './components/login';
import SignUp from './components/signup';
import './App.css';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/home" exact component={CreateRoom} />
          <Route path="/room/:roomID" component={Room} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
