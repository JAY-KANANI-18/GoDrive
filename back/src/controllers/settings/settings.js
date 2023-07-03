const Settings = require("../../model/settings")

let AcceptenceTimeForRide
let MaxStopsForRide
let email_client_id
let email_refresh_token
let email_secret
let sms_sid
let sms_token
let stripe_public_key
let stripe_secret_key



async function updateSettings() {
    try {

        data = await Settings.findOne()


  

        return data



                
       
    } catch (e) {
        console.log(e);

    }
}
updateSettings()


module.exports = 

    updateSettings
  





