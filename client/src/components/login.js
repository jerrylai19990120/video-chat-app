import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';



class Login extends React.Component{

    render(){
        return(
            <div style={{backgroundColor:'#F8C955', padding:"26vh", height:'343px'}}>
                <h1 style={{color:'white'}}>Welcome to Vivideo!</h1>
                <h2 style={{color:'white'}}>Join our diverse users community.</h2>
                <form>
                    <TextField id="standard-basic" label="Username"/><br/>
                    <TextField
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                    /><br/>
                    <Button variant="contained" color="primary" style={{width:"16%", height:'4vh', marginTop:'2vh'}}>
                        Log in
                    </Button><br/><br/>
                    <span style={{color:'#6F6F6F'}}>or <a href="/signup" style={{textDecoration:'none', color:'white'}}><strong>Sign up</strong></a> to join our community.</span>
                </form>
            </div>
        )
    }
}

export default Login;