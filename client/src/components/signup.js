import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {signUp} from '../actions/userActions';
import logo from '../images/logo.png';

class SignUp extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirm: '',
            invalid: false,
            warnings: '',
            emailInvalid: false,
            emailWarnings: '',
            duplicateName: false,
            nameWarn: ''
        }
    }


    render(){
        return(
            <div style={{backgroundColor:'#8ED1CD', padding:"18vh", height:'457px'}}>
                <div style={{height:"343px", width:'50%', float:'left'}}>
                    <h1 style={{color:'white'}}>Welcome to Vivideo!</h1>
                    <h2 style={{color:'white'}}>Join our diverse users community.</h2>
                    <img src={logo}></img>
                    <h2 style={{color:'white'}}>Enjoy the times with friends, family and loved ones.</h2>
                </div>
                <div style={{height:"343px", width:'50%', float:'left'}}>
                    <div style={{height:"128%", width:"80%", backgroundColor:'white', paddingTop:'10%', borderRadius:'16px', marginLeft:'8%', marginTop:'-8%'}}>
                    <h1 style={{color:'#67C7C1'}}>Sign Up</h1>
                        <form>
                            <TextField required id="standard-required" label="Username" onChange={(event)=>{this.setState({username: event.target.value})}}
                            error={this.state.duplicateName}
                            helperText={this.state.nameWarn}/><br/>
                            <TextField required id="standard-required" label="Email address" onChange={(event)=>{this.setState({email: event.target.value})}}
                            error={this.state.emailInvalid}
                            helperText={this.state.emailWarnings}/><br/>
                            <TextField required id="standard-required" label="Password" type='password' onChange={(event)=>{this.setState({password: event.target.value})}} error={this.state.invalid}/><br/>
                            <TextField required id="standard-required" label="Confirm password" type='password' onChange={(event)=>{this.setState({confirm: event.target.value})}}
                            error={this.state.invalid}
                            helperText={this.state.warnings}
                            /><br/><br/>
                            <Button variant="contained" color="primary" onClick={()=> {signUp(this, this.props.app)}}>
                                Join our community!
                            </Button><br/><br/>
                            <span style={{color:'#6F6F6F'}}>Already have an account? <a href='/' style={{textDecoration:'none', color:'#67C7C1'}}><strong>Log in</strong></a></span>
                        </form>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default SignUp;