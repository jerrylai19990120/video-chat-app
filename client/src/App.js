import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./components/Home";
import Room from "./components/Room";
import Login from './components/login';
import SignUp from './components/signup';
import './App.css';
import {useHistory} from 'react-router-dom';
import {readCookie} from "./actions/userActions";
import Chat from './components/Chat';


class App extends React.Component{

  constructor(props){
    super(props);
    readCookie(this);
    this.state = {
      currentUser: null,
      username: '',
      email: ''
    }
  }

  componentDidMount(){
      fetch('/check-session')
        .then(user => {
          return user.json();
        })
        .then(json => {
          const request = new Request('/findAnUser', {
              method:'post',
              body: JSON.stringify({
                  username: json.currentUser
              }),
              headers: {
                  Accept: 'application/json, text/plain, */*',
                  "Content-type": 'application/json'
              }
          })

          fetch(request)
            .then(result => {
              return result.json();
            })
            .then(result2 => {
              this.setState({username: result2.username, email: result2.email});
            })
            .catch(err => {
              console.log(err);
            })
        })
        .catch(err => {
          console.log(err);
        })
      
  }
  
  render(){

    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/home/room/:roomID" component={()=> <Room app={this}/>} />
            <Route path="/chat/:roomID" component={()=>{return Chat(useHistory(), this, this.state.username, this.state.email)}}/>
            <Route path='/home' component={()=>{if(!this.state.currentUser){useHistory().push('/')}else{return CreateRoom(useHistory(), this, this.state.username, this.state.email)}}}/>
            <Route exact path={['/', '/home', '/home/room/:roomID']} component={()=>{if(this.state.currentUser){return CreateRoom(useHistory().push('/home'), this, this.state.username, this.state.email)}else{return <Login app={this}/>}}}/>
            <Route exact path="/signUp" component={()=>{return <SignUp app={this}/>}}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
  
}

export default App;
