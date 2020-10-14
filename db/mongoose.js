
const mongoose = require('mongoose');
const uri = 'mongodb+srv://jerrylai:tg12345678@video-chat-app.gh6gt.mongodb.net/UserInfo?retryWrites=true&w=majority';

const mongoURI = process.env.MONGODB_URI || uri;

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})


module.exports = {mongoose};