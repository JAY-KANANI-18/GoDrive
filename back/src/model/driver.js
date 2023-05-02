const mongoose = require("mongoose")
const validator = require('validator')

const DriverSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        // trim: true,

    },

    mobile: {
        type: String,
        // required: true,
        // trim: true,
        // unique:true,


    },

    email: {
        type: String,
        // required: true,
        // trim: true,
        // lowercase: true,
        // unique: true,
        // validate(value) {

        //     if (!validator.isEmail(value)) {
        //         throw new Error("Email is not valid")
        //     }

        // }

    },
    country: {
        type: String,

    },
    city: {
        type: String,

    },
    profile: {
        type: String,
        default: 'default.jpeg'
    },
    approval:{
        type:String,
    },
    status:{
        type:String,
        default:'online'
    },currentride:{
        type:Object,
        default:'none'
    }

});


const Driver = mongoose.model('Driver', DriverSchema)

module.exports = Driver;


