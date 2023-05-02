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
        unique:true,
        // validate(value) {

        //     if (!validator.isEmail(value)) {
        //         throw new Error("Email is not valid")
        //     }

        // }

    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        unique:true,


    },
    country: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,


    },
    avatar: {
        type: String,
        default: 'default.jpeg'
    }

});


const User = mongoose.model('User', userSchema)

module.exports = User;


