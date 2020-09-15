import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./components/Home";
import Room from "./components/Room";
import Login from './components/login';
import SignUp from './components/signup';
import './App.css';
import {useHistory} from 'react-router-dom';
import {readCookie} from "./actions/userActions";


class App extends React.Component{

  constructor(props){
    super(props);
    readCookie(this);
    this.state = {
      currentUser: null
    }
  }
  
  render(){

    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/home/room/:roomID" component={Room} />
            <Route path="/" render={()=>{return <Login app={this}/>}}/>
            <Route path='/home' component={()=>{if(!this.state.currentUser){useHistory().push('/')}else{return CreateRoom(useHistory())}}}/>
            <Route exact path={['/', '/home', '/home/room/:roomID']} render={()=>{if(this.state.currentUser){return CreateRoom(useHistory().push('/home'))}else{return <Login app={this}/>}}}/>
            <Route exact path="/signup" component={()=>{if(this.state.currentUser){return CreateRoom(useHistory().push('/home'))}else{return <SignUp app={this}/>}}}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
  
}

export default App;
