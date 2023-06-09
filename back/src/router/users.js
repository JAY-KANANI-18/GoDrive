
const express = require('express')
const User = require('../model/user')
const multer = require('multer');
const stripe = require('stripe')('sk_test_51N2piRJAU9zBfSBOhszeL5HWLkSKstapCQzk6dbn4ZUjR8xBLPYZPP64VvIUJEACl5COj23WPMpTMBjD400xVSzi00q0Ayujkw');
const Driver = require('../model/driver');

const sendMail = require('../utils/email')

const sendSMS = require('../utils/sms')

const auth = require('../middleware/auth');
const { pipeline } = require('nodemailer/lib/xoauth2');
const { default: mongoose } = require('mongoose');
const usersController = require('../controllers/routes/usersController');


const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/avatars'); // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // specify the file size limit in bytes
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('please upload a jpg , jpeg or png'));
        }

        cb(null, true);
    }
});

const router = new express.Router()

router.post("/Users/Update/Save", upload.single('file'),auth, usersController.saveUpdatedUser);//----------> Save Updated Detail of USer       

router.post("/Users", upload.single('file'),auth,usersController.addUser);//--------------------> Add New User

router.get("/Users/Cards/default",auth,usersController.setDefaultCard);//----------------------> Set Users Default Card

router.get('/Users/Update',auth, usersController.getDetailForUpdate)//------------------------> Get User Detail for Upadte

router.get('/Users/Payment',auth,usersController.getPaymentFromUser)//------------------------> Get Payment of Ride Form User

router.get("/Users/Cards/delete",auth,usersController.deleteCard);//------------------------> Delete Card of User

router.get('/Users/Delete/:id',auth,usersController.deleteUser)//------------------------> Delete User

router.get('/Users/Cards',auth,usersController.getUserCards );//------------------------> Get All Added Card of User

router.post('/User/Data',auth, usersController.getAddedUser)//------------------------> Get Detail of User For Create Ride

router.post('/User/Card',auth, usersController.addUserCard)//------------------------> Add Card in User

router.get('/Users',auth, usersController.getUsers)//------------------------> Get All Added Usewer













module.exports = router
