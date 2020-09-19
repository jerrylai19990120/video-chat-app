import React, { useRef, useEffect, useState } from "react";
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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {logOut} from '../actions/userActions';
import Modal from '@material-ui/core/Modal';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import {useHistory} from 'react-router-dom';



const Room = (props) => {
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();


    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [roomID, setRoomID] = useState('');
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;

            socketRef.current = io.connect("/");
            socketRef.current.emit("join room", props.match.params.roomID);

            socketRef.current.on('other user', userID => {
                callUser(userID);
                otherUser.current = userID;
            });

            socketRef.current.on("user joined", userID => {
                otherUser.current = userID;
            });

            socketRef.current.on("offer", handleRecieveCall);

            socketRef.current.on("answer", handleAnswer);

            socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
        });

    }, []);

    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleRecieveCall(incoming) {
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    };

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

    const getRoomID = ()=>{
        return window.location.pathname.slice(11);
    }

    function create() {
        const id = shortid.generate();
        history.push(`/home/room/${id}`);
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
                            <Tab label={`Meeting ID: ${getRoomID()}`} />
                            <Tab label="Chat"/>
                            <Tab label="Video" />
                            <Tab label="Find Friends" />
                            <Tab label="Friend Requests" />
                            <Tab label="Profile" />
                        </Tabs>
                    </AppBar>
                </div>
                <div style={{height:"85.5%", width:'100%', backgroundColor:'#36393F'}}>
                    <div style={{height:"100%", width:"100%"}}>
                        <video autoPlay ref={userVideo} style={{height:'49%', width:'98%', border:'2px solid gray'}}/>
                        <video autoPlay ref={partnerVideo} style={{height:'49%', width:'98%', border:'2px solid gray'}}/>
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
};

export default Room;