import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class SignUp extends React.Component{

    render(){
        return(
            <div>
                <div>
                    <h1 style={{}}>Welcome to Vivideo!</h1>
                    <h2>Join our diverse users community.</h2>
                </div>
                <form>
                    <TextField required id="standard-required" label="Username" /><br/>
                    <TextField required id="standard-required" label="Email address" /><br/>
                    <TextField required id="standard-required" label="Password" /><br/>
                    <TextField required id="standard-required" label="Confirm password" /><br/><br/>
                    <Button variant="contained" color="primary">
                        Join our community!
                    </Button><br/>
                </form>
            </div>
        )
    }
}

export default SignUp;