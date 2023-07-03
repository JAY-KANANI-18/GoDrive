
async function UpdateSettingsofSMS(){
  const settings = require("../controllers/settings/settings");
   settingData = await settings()
   console.log(settingData.sms_sid);
    sid = settingData.sms_sid   // 'AC5a0e40ae9b47152c64a2318beb79061a'
    auth_token = settingData.sms_token  // '30a15be9c2bfd2e7ba2012dcca221095'
    twilio = require('twilio')(sid,auth_token)
}  
let twilio
 let sid
 let auth_token
UpdateSettingsofSMS()

const sendSMS = async (to, body) => {
    try {
      const message = await twilio.messages.create({
        from: '+12707174025',
        to,
        body,
      });
      console.log(`SMS sent to ${to}. Message SID: ${message.sid}`);
    } catch (error) {

      return error.message + " Error : In Sending SMS"
    }
  };
  
  module.exports = { sendSMS ,UpdateSettingsofSMS};