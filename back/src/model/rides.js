const mongoose = require("mongoose")
const validator = require('validator')

const RidesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'users',

    },
    pickup: {
        type: String,
        require: true

    },
    dropoff: {
        type: String,
        require: true


    },
    assignType: {
        type: Number,
        enum :[0,1,2,3,4]
    },
    stop: {
        type: Array,

    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'vehicles',


    },
    distance: {
        type: String,
        require: true
    },
    time: {
        type: String,
        require: true
    },
    bookingtime: {
        type: String,
        require: true

    }, status: {
        type: Number,
        enum:[0,1,2,3,4,5,6]
    },

    payment_type: {
        type: Number,
        enum:[0,1]
    }
    ,
    scheduletime: {
        type: String,

    },
    scheduledate: {
        type: String
    },
     driver: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'drivers',
    },
     rejected: {
        type: Array


    }
}, { timestamps: true });


const Rides = mongoose.model('Rides', RidesSchema)

module.exports = Rides;


