import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {signUp} from '../actions/userActions';


class SignUp extends React.Component{

    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <div style={{backgroundColor:'#F8C955', padding:"18vh", height:'457px'}}>
                <div>
                    <h1 style={{color:'white'}}>Welcome to Vivideo!</h1>
                    <h2 style={{color:'white'}}>Join our diverse users community.</h2>
                </div>
                <form>
                    <TextField required id="standard-required" label="Username" /><br/>
                    <TextField required id="standard-required" label="Email address" /><br/>
                    <TextField required id="standard-required" label="Password" /><br/>
                    <TextField required id="standard-required" label="Confirm password" /><br/><br/>
                    <Button variant="contained" color="primary" onClick={()=>{signUp(this.props.app)}}>
                        Join our community!
                    </Button><br/><br/>
                    <span style={{color:'#6F6F6F'}}>Already have an account? <a href='/' style={{textDecoration:'none', color:'white'}}><strong>Log in</strong></a></span>
                </form>
            </div>
        )
    }
}

export default SignUp;