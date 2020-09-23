import React from "react";
import {useEffect, useState, useRef} from 'react';
import io from "socket.io-client";
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import SettingsIcon from '@material-ui/icons/Settings';
import MicOffIcon from '@material-ui/icons/MicOff';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import profilePic from '../images/profilePic.jpg';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {logOut} from '../actions/userActions';
import Tabs from "@material-ui/core/Tabs";
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Radio from '@material-ui/core/Radio';

const shortid = require('shortid');

const Chat = (history)=>{
    const [yourID, setYourID] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [roomID, setRoomID] = useState('');
    const [selected, setSelected] = useState(false);

    const socketRef = useRef();
    useEffect(()=>{
        socketRef.current = io.connect('/');

        socketRef.current.on("your ID", (id)=>{
            setYourID(id)
        })

        socketRef.current.on("message", message=>{
            receiveMessage(message);
        })
    }, []);

    function receiveMessage(message){
        setMessages(oldMessages => [...oldMessages, message]);
    }

    function sendMessage(e){
        e.preventDefault();
        const newMessage = {
            body: message,
            id: yourID
        }
        setMessage("");
        socketRef.current.emit("send message", newMessage);
    }

    function handleChange(e){
        e.preventDefault();
        setMessage(e.target.value);
    }

    function openPopUp(){
        setOpen(true);
    }

    function closePopUp(){
        setOpen(false);
    }

    function join(history){
        if(selected){
            history.push(`/home/room/${roomID}`)
        }else{
            history.push(`/chat/${roomID}`);
        }
    }

    function handleRadioChange(val){
        if(val){
            setSelected(false);
        }else{
            setSelected(true)
        }
    }

    const useStyles = makeStyles((theme)=>({
        textField: {
            border:'1px solid gray',
            backgroundColor: 'white',
            borderRadius: '8px'
        }
    }))

    const getRoomID = ()=>{
        return window.location.pathname.slice(6);
    }

    function create() {
        const id = shortid.generate();
        history.push(`/home/room/${id}`);
    }


    const classes = useStyles();

    return(
        <div style={{height:"100vh", width:'100vw'}}>
            <div style={{height:'100%', width:'12.6%', float:'left'}}>
                <Drawer
                    variant="permanent"
                    anchor="left"
                    >
                    <Divider />
                    <List>
                        <ListItem style={{cursor: "pointer"}}>
                            <ListItemIcon><VideoCallIcon/></ListItemIcon>
                            <ListItemText primary='Create Room' onClick={create}/>
                        </ListItem>
                        <ListItem style={{cursor: "pointer"}}>
                            <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                            <ListItemText primary='Join Room' onClick={openPopUp}/>
                            <Modal
                                open={open}
                                onClose={closePopUp}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >
                                <div style={{width:'28vw', height:'38vh', backgroundColor:'white', marginLeft:'40vw', marginTop:'20vh', padding:'2%'}}>
                                    <h2 style={{color:'#556572'}}>Join Meeting</h2><br/>
                                    <TextField id="outlined-basic" label="Meeting id" variant="outlined" onChange={(e)=>{setRoomID(e.target.value)}}/><br/><br/>
                                    <Radio
                                        checked={!selected}
                                        onChange={()=>{handleRadioChange(1)}}
                                    />Chat&nbsp;&nbsp;&nbsp; 
                                    <Radio
                                        checked={selected}
                                        onChange={()=>{handleRadioChange(0)}}
                                    />Video <br/><br/>
                                    <Button onClick={closePopUp} variant="outlined" color="primary" style={{marginLeft:'16%'}}>Cancel</Button>
                                    <Button variant="outlined" color="primary" onClick={()=>{join(history)}} style={{marginLeft:'26%'}} disabled={(roomID==='')?true:false}>Join</Button>
                                </div>
                            </Modal>
                        </ListItem>
                        <ListItem style={{cursor: "pointer"}}>
                            <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                            <ListItemText primary='Jerry'/>
                        </ListItem>
                        <ListItem style={{cursor: "pointer"}}> 
                            <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                            <ListItemText primary='John'/>
                        </ListItem>
                        <ListItem style={{cursor: "pointer"}}>
                            <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                            <ListItemText primary='Allen'/>
                        </ListItem><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                        <ListItem style={{cursor: "pointer"}}>
                            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                            <Button variant="outlined" color="primary" onClick={logOut}>
                                Log out
                            </Button>
                        </ListItem>
                    </List>
                </Drawer>
            </div>
            <div style={{height: "100%", width:'87.4%', float:'left'}}>
                <div style={{height:"6.6%", width:'100%'}}>
                    
                    <AppBar position="static">
                    <Tabs aria-label="simple tabs example" centered={true}>
                        <button disabled={true} style={{color:'#ACB4DF', backgroundColor:'#3F51B5', border:'none', height:'46px'}}><strong>Meeting ID: {getRoomID()}</strong></button>
                        <Tab label="Chat"/>
                        <Tab label="Video" />
                        <Tab label="Find Friends" />
                        <Tab label="Friend Requests" />
                        <Tab label="Profile" />
                    </Tabs>
                    </AppBar>
                </div>
                <div style={{height:"85.5%", width:'100%', backgroundColor:'#36393F'}}>
                    <div style={{width:'100%', height:'80%', overflow: 'auto'}}>
                        {messages.map((message)=>{
                            if(message.id === yourID){
                                return(
                                    <section style={{width:'100%', float:'right', marginTop:'16px'}}>
                                        <TextField
                                            id="outlined-textarea"
                                            multiline
                                            variant="outlined"
                                            disabled
                                            value={message.body}
                                            style={{float:'right', marginRight:'26px'}}
                                            className={classes.textField}
                                        >
                                        </TextField>
                                    </section>
                                )
                            }
                            return(
                                <section style={{width:'100%', float:'left', marginTop:'16px'}}>
                                    <Avatar alt="user" src={profilePic} style={{float:'left', marginLeft:'26px', marginTop:'0px'}}/>
                                    <TextField
                                        id="outlined-textarea"
                                        multiline
                                        variant="outlined"
                                        disabled
                                        value={message.body}
                                        style={{float:'left', marginLeft:'10px'}}
                                        className={classes.textField}
                                    >
                                    </TextField>
                                </section>
                                
                            )
                        })}
                    </div>
                    <div style={{width:'100%', height:'20%'}}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Say something"
                            multiline
                            rows={1}
                            variant="outlined"
                            onChange={handleChange}
                            value={message}
                            className={classes.textField}
                            style={{marginTop:'36px', marginLeft:'54px'}}
                        />
                        <Button
                                variant="contained"
                                color="primary"
                                endIcon={<SendIcon/>}
                                onClick={sendMessage}
                                style={{marginTop:'46px', marginLeft:'20px'}}
                        >
                            Send
                        </Button>
                        
                    </div>
                </div>
                <div style={{width:'100%'}}>
                    <BottomNavigation
                        showLabels
                        >
                        <BottomNavigationAction label="Audio" icon={<MicOffIcon />} />
                        <BottomNavigationAction label="Video" icon={<VideocamOffIcon />} />
                        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
                    </BottomNavigation>
                </div>
            </div>
        </div>
    );
}

export default Chat;