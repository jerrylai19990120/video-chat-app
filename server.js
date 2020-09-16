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
const {User} = require('./models/user')
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
});

if(process.env.PROD){
    app.use(express.static(__dirname+"/client/build"));
    app.get('*', (req, res)=>{
        res.sendFile(__dirname+'/client/build/index.html')
    })
}

app.use(bodyParser.json());
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: 'oursecret',
        cookie:{
            httpOnly:true,
            expires: 60000
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
        res.send({currentUser: req.session.email});
    }else{
        res.status(401).send();
    }
})



const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`server is running on port ${port}`));
