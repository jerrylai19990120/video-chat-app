require("dotenv").config()
const express = require("express");
const bodyParser = require('body-parser');
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);


const {mongoose} = require('./db/mongoose');
mongoose.set('useFindAndModify', false);

const {ObjectID} = require('mongodb');
const {User} = require('./models/user');
const session = require('express-session');
const bcrypt = require('bcryptjs')

const rooms = {};

io.on("connection", socket => {
    socket.on("join room", roomID => {
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        if (otherUser) {
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id);
        }
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });

    socket.emit("your ID", socket.id);

    socket.on("send message", body => {
        io.emit("message", body);
    })
});


app.use(bodyParser.json());

app.use(
    session({
        secret: 'oursecret',
        resave: false,
        saveUninitialized: false,
        cookie:{
            expires: 600000,
            httpOnly:true
        }
    })
);

app.get('/loginAuth', (req, res)=>{
    User.find().then((users)=>{
        if(!users){
            res.status(404)
        }else{
            res.send(users)
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).send()
    })
})

app.post('/signup', (req, res)=>{
    if(mongoose.connection.readyState != 1){
		console.log("mongoose connection error");
		res.status(500).send("Internal server error");
		return;
    }
    
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(req.body.password, salt, function(err, hash){
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash
            })
            req.session.username = req.body.username;
            req.session.email = req.body.email;

            user.save().then(result => {
                res.send(result);
            }).catch(err => console.log(err))
        })
    })
    
})

app.post('/loginSession', (req, res)=>{

    const username = req.body.username;

    User.findByUsername(username).then(user => {
        req.session.username = user.username;
        req.session.email = user.email;
        res.send({currentUser: req.session.username});
    })
    .catch(err => {
        console.log(err)
        res.status(400).send()
    })
})

app.get('/check-session', (req, res)=>{
    if(req.session.username){
        res.send({currentUser: req.session.username});
    }else{
        res.status(401).send();
    }
})

app.get('/logout', (req, res)=>{
    req.session.destroy(error => {
        if(error){
            res.status(500).send()
        }else{
            res.send()
        }
    })
})

//send a friend request
app.put('/send-friend-request/:username/:sender', (req, res)=>{
    const username = req.params.username;
    const sender = req.params.sender;

    User.findOneAndUpdate({username: username}, {"$push": {requests: {username: sender, accepted: false}}}, {new: true, useFindAndModify: false}).then(result => {
        if(!result){
            res.status(404).send();
        }else{
            res.send(result);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    })
})

//add a friend
app.put('/acceptedFriend/:username/:sender', (req, res)=>{
    const username = req.params.username;
    const sender = req.params.sender;

    User.findOneAndUpdate({username: username}, {"$push": {friends: {username: sender}}}, {new: true, useFindAndModify: false}).then(result => {
        if(!result){
            res.status(404).send();
        }else{
            res.send(result);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    })

    User.findOneAndUpdate({username: sender}, {"$push": {friends: {username: username}}}, {new: true, useFindAndModify: false}).then(result => {
        if(!result){
            res.status(404).send();
        }else{
            res.send(result);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    })
})

//find a specific user
app.post('/findAnUser', (req, res)=>{
    const username = req.body.username;
    User.findByUsername(username).then(result => {
        if(!result){
            res.status(404).send();
        }else{
            res.send(result);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    })
})

//remove friend
app.put('/deleteFriend/:username/:friend', (req, res)=>{
    const username = req.params.username;
    const friend = req.params.friend;

    User.findOneAndUpdate({username: username}, {"$pull": {friends: {"username": friend}}}, {new: true, useFindAndModify: false}).then(result => {
        if(!result){
            res.status(404).send();
        }else{
            res.send(result);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    })

    User.findOneAndUpdate({username: friend}, {"$pull": {friends: {"username": username}}}, {new: true, useFindAndModify: false}).then(result => {
        if(!result){
            res.status(404).send();
        }else{
            res.send(result);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    })
})


//remove friend request
app.put('/declinedFriend/:username/:friend', (req, res)=>{
    const username = req.params.username;
    const friend = req.params.friend;

    User.findOneAndUpdate({username: username}, {"$pull": {requests: {"username": friend, "accepted": false}}}, {new: true, useFindAndModify: false}).then(result => {
        if(!result){
            res.status(404).send();
        }else{
            res.send(result);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    })
})

app.delete('/delete-account', (req, res)=>{

    const username = req.body.username;

    User.deleteOne({username: username}).then(result => {
        if(result){
            res.send(result);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    })
})

app.put('/change-password', (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOneAndUpdate({username: username}, {password: password}).then(result => {
        if(!result){
            res.status(404).send();
        }else{
            res.send(result);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    })
})

app.put('/change-email', (req, res)=>{
    
    const username = req.body.username;
    const email = req.body.email;
    User.findOneAndUpdate({username: username}, {email: email}).then(result => {
        if(!result){
            res.status(404).send();
        }else{
            res.send(result);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    })
})

//upload pictures
const multer = require('multer');
const AWS = require('aws-sdk');
const { resolve } = require("path");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

const storage = multer.memoryStorage({
    destination: function(req, file, cb){
        cb(null, '');
    }
})

const upload = multer({storage: storage}).single('image');

app.post('/upload', upload, (req, res)=>{

    let myFile = req.file.originalname.split('.');
    const fileType = myFile[myFile.length - 1];

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${req.session.username}.${fileType}`,
        Body: req.file.buffer
    }

    User.findOne({username: req.session.username}).then(user => {
        if(user){
            const params2 = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: user.profilePic
            }
            
            s3.deleteObject(params2, (err, data)=>{
                if (err) {
                    console.log(err)
                }
            })
        }
    })
    .catch(err => {
        console.log(err);
    })


    s3.upload(params, (err, data)=>{

        if (err) {
            res.status(500).send(err);
        }
        
        User.findOneAndUpdate({username: req.session.username}, {profilePic: `${req.session.username}.${fileType}`}).then(result => {
            if(result){
                res.status(200).send("File upload successfully.");
            }
        })
        .catch(err => {
            console.log(err)
        })
        
    })

})

app.post('/get-picture', (req, res)=>{

    User.findOne({username: req.body.username}).then(user => {
        if(user){
            res.send(user);
        }
    })
    .catch(err => {
        res.status(500).send(err);
    })
    
})

app.put('/delete-picture', (req, res)=>{
    
    User.findOne({username: req.body.username}).then(user => {
        if(user){
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: user.profilePic
            }

            s3.deleteObject(params, (err, data)=>{
                if (err) {
                    console.log(err)
                }
                
            })
        }
    })
    .catch(err => {
        console.log(err)
    })

    User.findOneAndUpdate({username: req.body.username}, {profilePic: 'none'}).then(result => {
        if(result){
            res.send(result);
        }
    })
    .catch(err => {
        console.log(err);
    })
})



const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`server is running on port ${port}`));

app.use(express.static(__dirname+"/client/build"));
app.get('*', (req, res)=>{
    res.sendFile(__dirname+'/client/build/index.html')
})
