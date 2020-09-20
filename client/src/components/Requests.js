import React from 'react';
import {useState} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import profilePic from "../images/profilePic.jpg";
import {makeStyles} from '@material-ui/core/styles';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckIcon from '@material-ui/icons/Check';


const Requests = () => {

    const [requests, setRequests] = useState([]);

    const useStyles = makeStyles((theme)=>({
        item: {
            color: 'white'
        }
    }))

    const classes = useStyles();

    function getRequests(){
        const request = new Request('/findAnUser', {
            method: 'post',
            body: JSON.stringify({
                username: 'jerrylai'
            }),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-type": "application/json"
            }
        })

        fetch(request)
            .then(user => {
                if(user){
                    return user.json();
                }
            })
            .then(json => {
                setRequests(json.requests);
            })
            .catch(err => {
                console.log(err);
            })
    }
    getRequests();

    const handleFriendRequest = (username, sender,accepted)=>{
        if(accepted){
            fetch(`/acceptedFriend/${username}/${sender}`, {method:'put'})
                .then(result => {
                    if(result.status===200){
                        return result.json();
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }else{
            fetch(`/declinedFriend/${username}/${sender}`, {method: 'put'})
                .then(result => {
                    if(result.status===200){
                        return result.json()
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
    return(
        <div style={{width: '40%', height: '100%', overflowY: 'auto', paddingTop:'2vh', textAlign:'left', marginLeft:'30%'}}>
            <h2 style={{color:'white'}}>All Requests</h2>
            <span style={{color:'#DCDDDE'}}>Know anybody here?</span>
            <List>
                {requests.map((req)=>{
                    if(req){
                        return(
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar alt="user" src={profilePic}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${req.username}`}
                                    className={classes.item}
                                />
                                <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="send">
                                        <CheckIcon className={classes.item} onClick={()=>{handleFriendRequest(req.username, "jerrylai", true)}}/>
                                    </IconButton>
                                    <IconButton edge="end" aria-label="send">
                                        <HighlightOffIcon className={classes.item} onClick={()=>{handleFriendRequest("jerrylai", req.username, false)}}/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    }else{
                        return "";
                    }
                })}
            </List>
        </div>
    )
}

export default Requests;