import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';



class Login extends React.Component{

    render(){
        return(
            <div style={{height:'100vh', width:'100vw', backgroundColor:'#47C5E3'}}>
                <div>
                    <h1 style={{}}>Welcome to Vivideo!</h1>
                    <h2>Join our diverse users community.</h2>
                </div>
                
                <form>
                    <TextField id="standard-basic" label="Username" /><br/>
                    <TextField
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                    /><br/>
                    <Button variant="contained" color="primary">
                        Log in
                    </Button><br/>
                    <span>or <a href="/signup" style={{textDecoration:'none', color:'white'}}>Sign up</a> to join our community.</span>
                </form>
            </div>
        )
    }
}

export default Login;