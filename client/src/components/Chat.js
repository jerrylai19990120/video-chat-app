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
import chatBg from '../images/chatBg.png';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {logOut} from '../actions/userActions';
import Tabs from "@material-ui/core/Tabs";



const Chat = ()=>{
    const [yourID, setYourID] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

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
                            <ListItemText primary='Create Room'/>
                        </ListItem>
                        <ListItem style={{cursor: "pointer"}}>
                            <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                            <ListItemText primary='Join Room'/>
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
                        </ListItem><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                        <ListItem style={{cursor: "pointer"}}>
                            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                            <Button variant="outlined" color="primary">
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
                        <Tab label="Chat" value={1}/>
                        <Tab label="Video" />
                        <Tab label="Find Friends" />
                        <Tab label="Friend Requests" />
                        <Tab label="Profile" />
                    </Tabs>
                    </AppBar>
                    
                    
                </div>
                <div style={{height:"85.5%", width:'100%', backgroundColor:'#36393F'}}>
                    {messages.map((message, index)=>{
                        return(
                        <p>{message.body}</p>
                        )
                    })}
                    <form onSubmit={sendMessage}>
                        <textarea placeholder="type..." onChange={handleChange} value={message}/>
                        <button>send</button>
                    </form>

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