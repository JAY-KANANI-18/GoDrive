
const express = require('express')
const multer = require('multer');
const Driver = require('../model/driver');
const Ride = require('../model/rides');
const User = require('../model/user');
const auth = require('../middleware/auth');
const { default: mongoose } = require('mongoose');
const driversController = require('../controllers/routes/driversController');


const stripe = require('stripe')('sk_test_51N2piRJAU9zBfSBOhszeL5HWLkSKstapCQzk6dbn4ZUjR8xBLPYZPP64VvIUJEACl5COj23WPMpTMBjD400xVSzi00q0Ayujkw');







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




router.patch("/Drivers/Update/Save", auth, upload.single('file'),driversController.SaveUpdatedDetailofDriver);

router.post("/Drivers", auth, upload.single('file'),driversController.addNewDriver );

router.get('/Drivers/RunningRequest', auth,driversController.getRunningRequest )

router.patch('/Drivers/Approve', auth,driversController.getApprovedDriver )

router.get('/Drivers', auth, driversController.getAllAddedDrivrsandSearch)

router.get('/Drivers/Delete/:id', auth, driversController.deleteDriver)

router.get('/Drivers/Online', auth, driversController.getOnlineDriver)

router.get('/Drivers/Update', auth, driversController.getDriverFromId)






module.exports = router
