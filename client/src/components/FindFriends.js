import React from 'react';
import {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import profilePic from "../images/profilePic.jpg";
import SendIcon from '@material-ui/icons/Send';
import {makeStyles} from '@material-ui/core/styles';


const FindFriends = () => {

    const [result, setResult] = useState('');
    const [input, setInput] = useState('');

    const outputResult = (val)=>{

        const request = new Request('/findAnUser', {
            method: 'post',
            body: JSON.stringify({
                username: val
            }),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-type": "application/json"
            }
        })

        fetch(request)
            .then(result => {
                if(result){
                    return result.json();
                }
            })
            .then(json => {
                setResult(json.username);
            })
    }


    const sendFriendRequest = ()=>{
        const request = new Request(`/send-friend-request/${result}/jason`, {
            method: 'put',
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-type": "application/json"
            }
        })
        fetch(request)
            .then(res => {
                if(res.status===200){
                    alert("Friend request is sended.")
                }else{
                    alert("Fail to send request.")
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const useStyles = makeStyles((theme)=>({
        textField: {
            border:'1px solid gray',
            backgroundColor: 'white',
            borderRadius: '8px'
        },
        item: {
            color: 'white'
        }
    }))

    const classes = useStyles();

    return(
        <div style={{width: '40%', height: '100%', overflowY: 'auto', paddingTop:'6vh', textAlign:'left', marginLeft:'30%'}}>
            <h3 style={{color:'white'}}>ADD FRIEND</h3><br/>
            <span style={{color:'#DCDDDE'}}>You can add a friend by finding their usernames. It's cAsE sEnSitIvE!</span><br/><br/>
            <TextField id="outlined-basic" label="Enter an Username" variant="outlined" onChange={(e)=>{setInput(e.target.value)}} className={classes.textField}/>
            <Button variant="contained" color="primary" onClick={()=>{outputResult(input)}} style={{marginLeft: '6%', marginTop: '1%'}}>Search</Button><br/>
            <List>
                {(result!=='')?
                    (
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar alt="user" src={profilePic}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${result}`}
                                className={classes.item}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="send">
                                    <SendIcon onClick={sendFriendRequest} className={classes.item}/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ):''
                }
            </List>
        </div>
    )
}

export default FindFriends;