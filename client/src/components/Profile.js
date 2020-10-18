import React, {useState, useEffect} from 'react';
import profilePic from "../images/profilePic.jpg";
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import {logOut} from '../actions/userActions';
import {useHistory, Redirect} from 'react-router-dom';

const bcrypt = require('bcryptjs');

const Profile = (props) => {

    const [open, setOpen] = useState(false);
    const [newMail, setNewMail] = useState('');
    const [oldMail, setOldMail] = useState('');
    const [conMail, setConMail] = useState('');
    const [newPass, setNewPass] = useState('');
    const [oldPass, setOldPass] = useState('');
    const [conPass, setConPass] = useState('');
    const [passModel, setPassModal] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
    const [picModal, setPicModal] = useState(false);
    const [picture, setPicture] = useState('none');
    const [delModal, setDelModal] = useState(false);

    const [oldValid, setOldValid] = useState(false);
    const [oldMessage, setOldMessage] = useState('');

    const [newPassword, setNewPassword] = useState(false);
    const [newPMessage, setNewPMessage] = useState('');

    const [conPassword, setConPassword] = useState(false);
    const [conPMessage, setConPMessage] = useState('');


    const [oldEmail, setOldEmail] = useState(false);
    const [oldEMessage, setOldEMessage] = useState('');

    const [newEmail, setNewEmail] = useState(false);
    const [newEMessage, setNewEMessage] = useState('');

    const [confirmE, setConfirmE] = useState(false);
    const [confirmEMessage, setConfirmEPMessage] = useState('');


    useEffect(() => {
        const username = props.currUser;

        const request = new Request('/get-picture', {
            method: 'post',
            body: JSON.stringify({
                username: username
            }),
            headers: {
                Accept: 'application/json, text/plain, */*',
                "Content-type": 'application/json'
            }
        })

        fetch(request)
            .then(result => {
                if(result.status===200){
                    return result.json();
                }
            })
            .then(json => {
                setPicture(json.profilePic);
            })
            .catch(err => {
                console.log(err);
            })

    }, [])

    const postToDB = ()=>{

        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newPass, salt, function(err, hash){
                
                const request = new Request('/change-password', {
                    method: 'put',
                    body: JSON.stringify({
                        username: props.currUser,
                        password: hash
                    }),
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        "Content-type": 'application/json'
                    }
                })

                fetch(request)
                    .then(result => {
                        if(result){
                            return result.json();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                
                    setPassModal(false);

            })
        })
    }

    const changePassword = async ()=>{

        const res = await new Promise((resolve, reject)=>{
            bcrypt.compare(props.passcode, oldPass, (err, res)=>{
                
                if(err){
                    reject(err);
                }
                resolve(res);
            })
        })

        if(!res){
            setOldValid(true);
            setOldMessage('password does not match');
            return;
        }else{
            setOldValid(false);
            setOldMessage('');
        }
        if(!(newPass === conPass)){
            setConPassword(true);
            setConPMessage('password does not match');
            return;
        }else{
            setConPassword(false);
            setConPMessage('');
        }
        
        postToDB();
        
    }

    const changeEmail = async ()=>{

                if(oldMail !== props.origEmail){
                    setOldEmail(true);
                    setOldEMessage('Old email does not match');
                    return;
                }else{
                    setOldEmail(false);
                    setOldEMessage('');
                }

                if(!(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(newMail))){
                    setNewEmail(true);
                    setNewEMessage('improper email address');
                    return;
                }else{
                    setNewEmail(false);
                    setNewEMessage('');
                }
                if(!(newMail === conMail)){
                    setConfirmE(true);
                    setConfirmEPMessage('email address does not match');
                    return;
                }else{
                    setConfirmE(false);
                    setConfirmEPMessage('');
                }

                const request = new Request('/change-email', {
                    method: 'put',
                    body: JSON.stringify({
                        username: props.currUser,
                        email: newMail
                    }),
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        "Content-type": 'application/json'
                    }
                })

                fetch(request)
                    .then(result => {
                        if(result){
                            return result.json();
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })

                setEmailModal(false);
    }

    const deleteAcc = ()=>{
        const username = props.currUser;

        const request = new Request('/delete-account', {
            method: 'delete',
            body: JSON.stringify({
                username: username
            }),
            headers: {
                Accept: 'application/json, text/plain, */*',
                "Content-type": 'application/json'
            }
        })

        fetch(request)
            .then(result => {
                if(result.status===200){
                    return result.json();
                }
            })
            .catch(err => {
                console.log(err);
            })
        
        setOpen(false);
    }

    const closePopUp = ()=>{
        setOpen(false);
    }
    const closePassModal = ()=>{
        setPassModal(false);
    }
    const closeEmailModal = ()=>{
        setEmailModal(false);
    }
    const closePicModal = ()=>{
        setPicModal(false);
    }

    const closeDelModal = () => {
        setDelModal(false);
    }

    const deletePicture = () => {
        setPicture('none');
        const username = props.currUser;

        const request = new Request('/delete-picture', {
            method: 'put',
            body: JSON.stringify({
                username: username
            }),
            headers: {
                Accept: 'application/json, text/plain, */*',
                "Content-type": 'application/json'
            }
        })

        fetch(request)
            .then(result => {
                if(result.status===200){
                    return result.json();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    const history = useHistory();


    return(
        <div style={{width: '40%', height: '100%', overflowY: 'auto', paddingTop:'2vh', textAlign:'center', marginLeft:'30%', lineHeight:'46px'}}>
            {(picture==='none')?<img alt="profile" src={profilePic} style={{width:'36%', height:'26%'}}></img>: <img alt="picture" src={`https://my-web-app-db.s3.amazonaws.com/${picture}`} style={{width:'36%', height:'26%'}}></img>}
            <h2 style={{color:'white'}}>{props.currUser}</h2>
            <span style={{cursor:'pointer', color:'white'}} onClick={()=>{setPassModal(true);setNewPMessage("");setOldMessage('');setConPMessage('');
        setOldValid(false);setNewPassword(false);setConPassword(false)}}>Change password</span><br/>
            <span style={{cursor:'pointer', color:'white'}} onClick={()=>{setPicModal(true)}}>Change profile picture</span><br/>
            <span style={{cursor:'pointer', color:'white'}} onClick={()=>{setDelModal(true)}} disabled={picture==='none'}>Delete profile picture</span><br/>
            <span style={{cursor:'pointer', color:'white'}} onClick={()=>{setEmailModal(true);setNewEMessage("");setConfirmEPMessage('');setOldEMessage('');
        setNewEmail(false);setOldEmail(false);setConfirmE(false)}}>Change email</span><br/><br/>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={()=>{setOpen(true)}}
            >
                Delete account
            </Button>
            <Modal
                        open={open}
                        onClose={closePopUp}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        >
                        <div style={{width:'28vw', height:'38vh', backgroundColor:'white', marginLeft:'40vw', marginTop:'20vh', padding:'2%', textAlign:'center'}}>
                            <h2>Are you sure you want to delete your account?</h2><br/><br/><br/>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                onClick={()=>{logOut(props.app);deleteAcc();history.push('/')}}
                            >
                                Delete
                            </Button>
                            <Button variant="outlined" onClick={()=>{setOpen(false)}} style={{marginLeft:"6%"}}>Cancel</Button>
                        </div>
            </Modal>
            <Modal
                        open={emailModal}
                        onClose={closeEmailModal}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        >
                        <div style={{width:'28vw', height:'38vh', backgroundColor:'white', marginLeft:'40vw', marginTop:'20vh', padding:'2%', textAlign:'center'}}>
                            <TextField required id="standard-required" label="Old Email"  onChange={(event)=>{setOldMail(event.target.value)}} error={oldEmail} helperText={oldEMessage}/><br/>
                            <TextField required id="standard-required" label="New Email" onChange={(event)=>{setNewMail(event.target.value)}}  error={newEmail} helperText={newEMessage}/><br/>
                            <TextField required id="standard-required" label="Confirm Email" onChange={(event)=>{setConMail(event.target.value)}} error={confirmE} helperText={confirmEMessage}/><br/><br/><br/><br/>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={changeEmail}
                            >
                                Change
                            </Button>
                            <Button variant="outlined" onClick={()=>{setEmailModal(false)}} style={{marginLeft:"6%"}}>Cancel</Button>
                        </div>
            </Modal>
            <Modal
                        open={passModel}
                        onClose={closePassModal}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        >
                        <div style={{width:'28vw', height:'38vh', backgroundColor:'white', marginLeft:'40vw', marginTop:'20vh', padding:'2%', textAlign:'center'}}>
                            <TextField required id="standard-required" label="Old password" onChange={(event)=>{setOldPass(event.target.value);setOldValid(false);
        setOldMessage('');}} type='password' error={oldValid} helperText={oldMessage}/><br/>
                            <TextField required id="standard-required" label="New password" onChange={(event)=>{setNewPass(event.target.value);setNewPassword(false);
        setNewPMessage('');}} type='password' error={newPassword} helperText={newPMessage}/><br/>
                            <TextField required id="standard-required" label="Confirm password" onChange={(event)=>{setConPass(event.target.value);setConPassword(false);
        setConPMessage('');}} type='password' error={conPassword} helperText={conPMessage}/><br/><br/><br/><br/>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={changePassword}
                            >
                                Change
                            </Button>
                            <Button variant="outlined" onClick={()=>{setPassModal(false)}} style={{marginLeft:"6%"}}>Cancel</Button>
                        </div>
            </Modal>
            <Modal
                        open={picModal}
                        onClose={closePicModal}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        >
                        <div style={{width:'28vw', height:'38vh', backgroundColor:'white', marginLeft:'40vw', marginTop:'20vh', padding:'2%', textAlign:'center'}}>
                        <form method="post" target="_blank" action="/upload" encType="multipart/form-data" id="pic" style={{padding: '20%'}}>
                            <input type='file' name="image" style={{marginLeft: '16%'}}/><br/><br/><br/><br/>
                            <Button variant="outlined" onClick={()=>{setPicModal(false);document.getElementById('pic').submit()}} style={{marginLeft:"6%"}}>Upload</Button>
                            <Button variant="outlined" onClick={()=>{setPicModal(false)}} style={{marginLeft:"6%"}}>Cancel</Button>
                        </form>
                        </div>
            </Modal>
            <Modal
                        open={delModal}
                        onClose={closeDelModal}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        >
                        <div style={{width:'28vw', height:'38vh', backgroundColor:'white', marginLeft:'40vw', marginTop:'20vh', padding:'2%', textAlign:'center'}}>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                onClick={()=>{setDelModal(false);deletePicture();}}
                            >
                                Delete
                            </Button>
                            <Button variant="outlined" onClick={()=>{setDelModal(false)}} style={{marginLeft:"6%"}}>Cancel</Button>
                        </div>
            </Modal>
        </div>
    )
}

export default Profile;