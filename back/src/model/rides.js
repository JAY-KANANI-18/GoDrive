const mongoose = require("mongoose")
const validator = require('validator')

const RidesSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        // trim: true,

    },

    phone: {
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
    pickup: {
        type: String,

    },
    dropoff: {
        type: String,

    },
    stop: {
        type: String,

    },
    vehicle: {
        type: String,

    },
    distance: {
        type: String,

    },
    time: {
        type: String,

    },
    bookingtime:{
        type:String
    },status:{
        type:String
    }

} );


const Rides = mongoose.model('Rides', RidesSchema)

module.exports = Rides;


