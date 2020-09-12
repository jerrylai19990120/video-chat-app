
const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    }
})

const UserSchema = new mongoose.Schema({

    username:{
        type: String,
        minlength: 2,
        required: true
    },

    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    friends:{
        type:[FriendSchema]
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = {User};
