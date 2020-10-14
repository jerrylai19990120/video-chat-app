import React, {useState} from 'react';
import profilePic from "../images/profilePic.jpg";
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import { set } from 'mongoose';
import TextField from '@material-ui/core/TextField';
import {logOut} from '../actions/userActions';
import {useHistory} from 'react-router-dom';
import S3 from 'aws-s3'; 
import ImageUploader from 'react-images-upload';




const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: "AKIAJ2YMMAOIXUYHF6PA",
    secretAccessKey: "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"
})
s3.getObject({Bucket: 'my-web-app-db', Key: 'jerrylai.jpg'}, (err, data)=>{
    if(err){
        alert(err);
    }else{
        alert(data);
    }
})



const Profile = (props) => {

    const [open, setOpen] = useState(false);
    const [newMail, setNewMail] = useState('');
    const [newPass, setNewPass] = useState('');
    const [passModel, setPassModal] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
    const [picModal, setPicModal] = useState(false);
    const [picture, setPicture] = useState(false);


    const changePassword = ()=>{

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


    const changeEmail = ()=>{

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

        setEmailModal(false)
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
    const history = useHistory();

    async function getImage(){
        const data =  s3.getObject(
            {
                Bucket: 'my-web-app-db',
                Key: 'jerrylai.jpg'
                }
            
            ).promise();
            return data;
    }
    function encode(data){
        let buf = Buffer.from(data);
        let base64 = buf.toString('base64');
        return base64
    }

    return(
        <div style={{width: '40%', height: '100%', overflowY: 'auto', paddingTop:'2vh', textAlign:'center', marginLeft:'30%', lineHeight:'46px'}}>
            {(picture===false)?<img alt="profile" src={profilePic} style={{width:'36%', height:'26%'}}></img>: ''}
            <h2 style={{color:'white'}}>{props.currUser}</h2>
            <span style={{cursor:'pointer', color:'white'}} onClick={()=>{setPassModal(true)}}>Change password</span><br/>
            <span style={{cursor:'pointer', color:'white'}} onClick={()=>{setPicModal(true)}}>Change profile picture</span><br/>
            <span style={{cursor:'pointer', color:'white'}} onClick={()=>{setEmailModal(true)}}>Change email</span><br/><br/><br/>
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
                            <TextField required id="standard-required" label="Old Email" /><br/>
                            <TextField required id="standard-required" label="New Email" onChange={(event)=>{setNewMail(event.target.value)}}/><br/>
                            <TextField required id="standard-required" label="Confirm Email"  /><br/><br/><br/><br/>
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
                            <TextField required id="standard-required" label="Old password" type='password'/><br/>
                            <TextField required id="standard-required" label="New password" onChange={(event)=>{setNewPass(event.target.value)}} type='password'/><br/>
                            <TextField required id="standard-required" label="Confirm password" type='password'/><br/><br/><br/><br/>
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
                        <form method="post" action="/upload" encType="multipart/form-data" id="pic">
                            <input type='file' name="image"/>
                            <button type="submit" onClick={()=>{setPicModal(false); document.getElementById('pic').submit();}}>Upload</button>
                            <Button variant="outlined" onClick={()=>{setPicModal(false)}} style={{marginLeft:"6%"}}>Cancel</Button>
                        </form>
                        </div>
            </Modal>
        </div>
    )
}

export default Profile;