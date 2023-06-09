

let sid = 'AC5a0e40ae9b47152c64a2318beb79061a'
let auth_token = '30a15be9c2bfd2e7ba2012dcca221095'
const twilio = require('twilio')(sid,auth_token)


const sendSMS = async (to, body) => {
    try {
      const message = await twilio.messages.create({
        from: '+12707174025',
        to,
        body,
      });
      console.log(`SMS sent to ${to}. Message SID: ${message.sid}`);
    } catch (error) {
      console.error(`Error sending SMS to ${to}:`, error);
    }
  };
  
  module.exports = { sendSMS };