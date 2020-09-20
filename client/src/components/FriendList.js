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


const FriendList = () => {

    const [friends, setFriends] = useState([]);
    const [hide, setHide] = useState(true);

    function getFriends(){
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
                setFriends(json.friends);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const useStyles = makeStyles((theme)=>({
        item: {
            color: 'white'
        }
    }))

    const classes = useStyles();
    getFriends();

    const removeFriend = (friend)=>{
        fetch(`/deleteFriend/jerrylai/${friend}`, {method: 'put'})
            .then(result => {
                if(result===200){
                    return result.json();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return(
        <div style={{width: '40%', height: '100%', overflowY: 'auto', paddingTop:'2vh', textAlign:'left', marginLeft:'30%'}}>
            <h2 style={{color:'white'}}>All friends</h2>
            <span style={{color:'#DCDDDE'}}>See what your friends are up to.</span>
            <div hidden={hide}>
                Looks like it's pretty empty here.
            </div>
            <List hidden={!hide}>
                {
                friends.map((friend)=>{
                    if(friend){
                        return(
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar alt="user" src={profilePic}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${friend.username}`}
                                    className={classes.item}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="send">
                                        <HighlightOffIcon className={classes.item} onClick={()=>{removeFriend(friend.username)}}/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            )
                        }else{
                            return "";
                        }
                    })
                }
            </List>
            
        </div>
    )
}

export default FriendList;