import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./components/Home";
import Room from "./components/Room";
import Login from './components/login';
import SignUp from './components/signup';
import './App.css';


class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      currentUser: null
    }
  }
  
  render(){
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/room/:roomID" component={Room} />
            <Route exact path={['/', '/home', '/room/:roomID']} render={()=>(!this.state.currentUser?<Login app={this}/>:<CreateRoom/>)}/>
            <Route exact path="/signup" render={()=>(!this.state.currentUser?<SignUp app={this}/>:<CreateRoom/>)}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
  
}

export default App;
