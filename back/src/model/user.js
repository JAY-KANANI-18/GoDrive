const mongoose = require("mongoose")
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,



    },


    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,


    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        unique: true,


    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'countries',
        trim: true,
        lowercase: true,


    },
    avatar: {
        type: String,
        default: 'default.jpeg'
    }, stripeid: {
        type: String
    }

});


const User = mongoose.model('User', userSchema)

module.exports = User;


