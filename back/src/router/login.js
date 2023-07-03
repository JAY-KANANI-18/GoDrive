const express = require("express");
const multer = require("multer");
const login = require("./login");
const Login = require("../model/login");
const auth = require("../middleware/auth");
const loginController = require("../controllers/routes/loginController");

const router = new express.Router();

router.post("/users/login", loginController.loginUser);



router.post('/users/logout', loginController.LogOutUserasync)
// router.post('/users/logoutall', auth, async (req, res) => {
//   try {
//       req.user.tokens = []

//       await req.user.save()
//       res.send()

//   } catch (e) {

//       res.status(500).send()
//   }
// })

router.post("/login", loginController.registerUser);

router.get("/auth", auth, loginController.checkAuthentication);

module.exports = router;
