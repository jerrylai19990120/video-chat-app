import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {login} from '../actions/userActions';
import logo from '../images/logo.png';



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
            <div style={{backgroundColor:'#8ED1CD', padding:"26vh", height:'343px'}}>
                <div style={{height:"343px", width:'50%', float:'left'}}>
                    <h1 style={{color:'white'}}>Welcome to Vivideo!</h1>
                    <h2 style={{color:'white'}}>Join our diverse users community.</h2>
                    <img src={logo}></img>
                    <h2 style={{color:'white'}}>Enjoy the times with friends, family and loved ones.</h2>
                </div>
                <div style={{height:"343px", width:'50%', float:'left'}}>
                    <div style={{height:"106%", width:"80%", backgroundColor:'white', paddingTop:'10%', borderRadius:'16px', marginLeft:'8%', marginTop:'-8%'}}>
                        <h1 style={{color:'#67C7C1'}}>Log In</h1>
                        <form>
                            <TextField id="standard-basic" label="Username" onChange={(event)=>{this.setState({username: event.target.value})}}/><br/>
                            <TextField
                                id="standard-password-input"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                onChange={(event)=>{this.setState({password: event.target.value})}}
                            /><br/>
                            <Button variant="contained" color="primary" style={{width:"28%", height:'4vh', marginTop:'2vh'}} onClick={()=>{login(this, this.props.app)}}>
                                Log in
                            </Button><br/><br/>
                            <span style={{color:'#6F6F6F'}}>or <a href="/signup" style={{textDecoration:'none', color:'#67C7C1'}}><strong>Sign up</strong></a> to join our community.</span>
                        </form>
                    </div>
                    
                </div>
                
            </div>
        )
    }
}

export default Login;