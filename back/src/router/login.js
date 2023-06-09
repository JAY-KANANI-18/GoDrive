const express = require('express')
const multer = require('multer');
const login = require('./login');
const Login = require('../model/login');
const auth = require('../middleware/auth');
const loginController = require('../controllers/routes/loginController');


const router = new express.Router()


router.post('/users/login',loginController.loginUser)


// router.get('/users/loginss', async (req, res) => {
//   console.log('tesssssssssssssssssssssssss');
//   try {
//     res.send('success')


//   } catch (e) {
//     console.log('zara get me hoga error');
//     // res.status(400).send("tako")
//   }
// })



// router.post('/users/logout', auth, async (req, res) => {
//   try {
//       req.user.tokens = req.user.tokens.filter((token) => {
//           return token.token !== req.token
//       })
//       await req.user.save()
//       res.send()

//   } catch (e) {
//       res.status(500).send()
//   }
// })
// router.post('/users/logoutall', auth, async (req, res) => {
//   try {
//       req.user.tokens = []

//       await req.user.save()
//       res.send()

//   } catch (e) {

//       res.status(500).send()
//   }
// })





router.post('/login',loginController.registerUser)


router.get('/auth',loginController.checkAuthentication)




module.exports = router
