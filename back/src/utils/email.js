const { google } = require('googleapis');
const nodemailer = require('nodemailer')

const CLIENT_ID = '1031912845591-gabidn4eeru204mat5pcjf3k7gt0h1fp.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN ='1//04DEh6f1gMuP2CgYIARAAGAQSNwF-L9Ir1n1WVZSb6JJueEoDPH_5GOPeHfNGZ8wWT06qDF40QhaULHWZToHw71kViwTC9ky9e3o'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)

oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

async function sendMail(to,subject,text){
    try{
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                type:'OAuth2',
                user:'jkanani.elluminati@gmail.com',
                clientId:CLIENT_ID,
                clientSecret:CLIENT_SECRET,
                refreshToken:REFRESH_TOKEN,
                accessToken:accessToken

            }
        })
        const mailOptions = {
            from:'GoDrive  <jaykanani2887@gmail.com>',
            to:to,
            subject:subject,
            text:text,
            html:'<h1>hello from GoDrive Team</h1>'
        
        
        }
        const result = await transport.sendMail(mailOptions)
        return result



    }catch(error){
        console.log('errrrrrrrrrrrrrr');
        return error

    }


}

module.exports = { sendMail };
