import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {login} from '../actions/userActions';



class Login extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    render(){
        return(
            <div style={{backgroundColor:'#F8C955', padding:"26vh", height:'343px'}}>
                <h1 style={{color:'white'}}>Welcome to Vivideo!</h1>
                <h2 style={{color:'white'}}>Join our diverse users community.</h2>
                <form>
                    <TextField id="standard-basic" label="Username" onChange={(event)=>{this.setState({username: event.target.value})}}/><br/>
                    <TextField
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        onChange={(event)=>{this.setState({password: event.target.value})}}
                    /><br/>
                    <Button variant="contained" color="primary" style={{width:"16%", height:'4vh', marginTop:'2vh'}} onClick={()=>{login(this, this.props.app)}}>
                        Log in
                    </Button><br/><br/>
                    <span style={{color:'#6F6F6F'}}>or <a href="/signup" style={{textDecoration:'none', color:'white'}}><strong>Sign up</strong></a> to join our community.</span>
                </form>
            </div>
        )
    }
}

export default Login;