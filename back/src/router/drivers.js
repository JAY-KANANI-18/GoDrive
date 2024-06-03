
const express = require('express')
const multer = require('multer');
const Driver = require('../model/driver');
const Ride = require('../model/rides');
const User = require('../model/user');
const auth = require('../middleware/auth');
const { default: mongoose } = require('mongoose');
const driversController = require('../controllers/routes/driversController').driversController;
const settings = require("../controllers/settings/settings");

let stripe_secret_key = settings.stripe_secret_key



const stripe = require('stripe')(stripe_secret_key);







const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, '../public/avatars'); // './public/images/' directory name where save the file
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
            const error = ('Please upload a jpg, jpeg, or png');
            error.statusCode = 400; // You can set an appropriate status code
            return cb(error, false);
        }

        cb(null, true);
    }
});


const handleMulterError = (err, req, res, next) => {
    console.log(err);
    if (err instanceof multer.MulterError) {
        // Multer error occurred
        return res.status(400).json({ msg: err.message });
    } else if (err) {
        // Other error occurred
        return res.status(500).json({ msg: err });
    }
    next();
  };
  
const router = new express.Router()




router.patch("/Drivers/Update/Save", upload.single('profile'),handleMulterError,auth,driversController.SaveUpdatedDetailofDriver);

router.post("/Drivers",upload.single('profile'),handleMulterError, auth,driversController.addNewDriver );

router.get('/Drivers/RunningRequest', auth,driversController.getRunningRequest )

router.patch('/Drivers/Approve', auth,driversController.getApprovedDriver )

router.get('/Drivers', auth, driversController.getAllAddedDrivrsandSearch)

router.get('/Drivers/Delete/:id', auth, driversController.deleteDriver)

router.post('/Drivers/Online', auth, driversController.getOnlineDriver)

router.get('/Drivers/Update', auth, driversController.getDriverFromId)






module.exports = router
