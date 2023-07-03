const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const Settings = require("../model/settings");
let CLIENT_ID 
let  CLIENT_SECRET 
let REDIRECT_URI
let REFRESH_TOKEN
let oAuth2Client

 REDIRECT_URI = "https://developers.google.com/oauthplayground";


 async function UpdateSettingsofEmail(){
  const settings = require("../controllers/settings/settings");
   settingData = await settings()
   CLIENT_ID = settingData.email_client_id 
   CLIENT_SECRET= settingData.email_secret
   REFRESH_TOKEN= settingData.email_refresh_token
   
   
   oAuth2Client = new google.auth.OAuth2(
   CLIENT_ID,
   CLIENT_SECRET,
   REDIRECT_URI
 );
 oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

   
  }  
  UpdateSettingsofEmail()
  
  

async function sendMail(to, subject, text,html = null) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "jkanani.elluminati@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      from: "GoDrive  <jaykanani2887@gmail.com>",
      to: to,
      subject: subject,
      text: text,
      html: html ||        `<h1>hello from GoDrive Team</h1><head>`
    };
    const result = await transport.sendMail(mailOptions);
    console.log(result);
  } catch (error) {
    return error.message + " In Sending Email";
  }
}

module.exports = { sendMail,UpdateSettingsofEmail };
