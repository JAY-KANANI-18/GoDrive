const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const SettingsSchema = new mongoose.Schema({
    AcceptenceTimeForRide: {
        type: Number,

    },MaxStopsForRide: {
        type:Number,
    },sms_sid:{
        type:String
    },sms_token:{
        type:String
    },email_client_id:{
        type:String

    },email_secret:{
        type:String


    },email_refresh_token:{
        type:String


    },stripe_public_key:{
        type:String

    }

   

});

const Settings = mongoose.model('Settings', SettingsSchema)

module.exports = Settings;
