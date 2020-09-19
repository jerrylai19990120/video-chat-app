import React from "react";
import {useState} from 'react';
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
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';

const shortid = require('shortid');


const CreateRoom = (history, app) => {
    const [open, setOpen] = useState(false);
    const [roomID, setRoomID] = useState('');
    const [selected, setSelected] = useState(false);

    function create() {
        const id = shortid.generate();
        history.push(`/home/room/${id}`);
    }

    function openPopUp(){
        setOpen(true);
    }

    function closePopUp(){
        setOpen(false);
    }

    function join(history){
        if(selected){
            history.push(`/room/${roomID}`)
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


    return (
        <div style={{height:"100vh", width:'100vw'}}>
            <div style={{height:'100%', width:'12.6%', float:'left'}}>
                <Drawer
                    variant="permanent"
                    anchor="left"
                    >
                    <Divider />
                    <List>
                        <ListItem style={{cursor: "pointer"}} onClick={create}>
                            <ListItemIcon><VideoCallIcon/></ListItemIcon>
                            <ListItemText primary='Create Room'/>
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
                                <div style={{width:'28vw', height:'38vh', backgroundColor:'white', marginLeft:'40vw', marginTop:'20vh'}}>
                                    <h2>Join Meeting</h2><br/>
                                    <TextField id="outlined-basic" label="Meeting id" variant="outlined" onChange={(e)=>{setRoomID(e.target.value)}}/><br/>
                                    <Radio
                                        checked={!selected}
                                        onChange={()=>{handleRadioChange(1)}}
                                    />Chat&nbsp;&nbsp;&nbsp; 
                                    <Radio
                                        checked={selected}
                                        onChange={()=>{handleRadioChange(0)}}
                                    />Video <br/>
                                    <Button onClick={closePopUp} variant="outlined" color="primary">Cancel</Button>
                                    <Button variant="outlined" color="primary" onClick={()=>{join(history)}}>Join</Button>
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
                            <Button variant="outlined" color="primary" onClick={()=>{history.push('/');logOut(app)}}>
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
                            <Tab label="Chat" onClick={()=>{history.push(`/chat/${shortid.generate()}`)}}/>
                            <Tab label="Video" />
                            <Tab label="Find Friends" />
                            <Tab label="Friend Requests" />
                            <Tab label="Profile" />
                        </Tabs>
                    </AppBar>
                </div>
                <div style={{height:"85.5%", width:'100%', backgroundColor:'#36393F'}}>
                    <img src={chatBg} alt={""} style={{width:"50%", marginLeft:'2%', marginTop:'6%'}}/><br/>
                    <span style={{color:'#B7B9BC', marginLeft:'2%'}}>Looks like no one's here yet......</span>
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
    )
}

export default CreateRoom;