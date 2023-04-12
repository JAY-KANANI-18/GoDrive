// server side


const mongoose = require("mongoose")
const express = require("express");
const path = require('path')
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

let index = require('./router/user');
const userRouter = require("../src/router/user")
const loginRouter = require("../src/router/login")
const User = require(`./model/user`)

const app = express()
app.use(cors())
app.use(express.json())
mongoose.set('strictQuery', true)
mongoose.connect("mongodb://127.0.0.1:27017/GoDrive")


// const publicDiractoryPath = path.join(__dirname, '../public')
// const viewPath = path.join(__dirname, "../src/templates/views")

// app.set('view engine', 'hbs')
// app.set('views', viewPath)

app.use(loginRouter)

// app.use(express.static(publicDiractoryPath))
// app.use(userRouter)
// app.use(bodyParser.json());


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());














// **************************  MASS  INSERT USER MANUAL    **************************
// async function adduser (){
//     for (let i = 1; i <= 50; i++) {

//         const user = new User({
//             name:`user`,
//             mobile:10000000000-i,
//             country:`india`,
//             email:`user${i}@gmail.com`
//         }
//         )
//         await user.save()
//     }

// }
//     for(i=0;i<50 ;i++){

//         const user = new User({
//             name:`user${i}`,
//             mobile:10000000000-i,
//             country:`india${i}`,
//             email:`user${i}@gmail.com`

//         })


    // adduser()
// }
// ***************************** End ***************************








app.listen(3000, () => {
    console.log('port is runiing...(at 3000)')
})

