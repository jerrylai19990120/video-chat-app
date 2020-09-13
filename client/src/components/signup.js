import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {signUp} from '../actions/userActions';


class SignUp extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirm: ''
        }
    }

    getTextValue(e){
        this.setState({username: e.target.value})
    }

    render(){
        return(
            <div style={{backgroundColor:'#F8C955', padding:"18vh", height:'457px'}}>
                <div>
                    <h1 style={{color:'white'}}>Welcome to Vivideo!</h1>
                    <h2 style={{color:'white'}}>Join our diverse users community.</h2>
                </div>
                <form>
                    <TextField required id="standard-required" label="Username" onChange={(event)=>{this.setState({username: event.target.value})}}/><br/>
                    <TextField required id="standard-required" label="Email address" onChange={(event)=>{this.setState({email: event.target.value})}}/><br/>
                    <TextField required id="standard-required" label="Password" onChange={(event)=>{this.setState({password: event.target.value})}}/><br/>
                    <TextField required id="standard-required" label="Confirm password" onChange={(event)=>{this.setState({confirm: event.target.value})}}/><br/><br/>
                    <Button variant="contained" color="primary" onClick={signUp(this, this.props.app)}>
                        Join our community!
                    </Button><br/><br/>
                    <span style={{color:'#6F6F6F'}}>Already have an account? <a href='/' style={{textDecoration:'none', color:'white'}}><strong>Log in</strong></a></span>
                </form>
            </div>
        )
    }
}

export default SignUp;