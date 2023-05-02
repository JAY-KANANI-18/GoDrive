

const express = require('express')

const multer = require('multer');

const Rides = require("../model/rides") 



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


router.post("/addRide", async (req, res) => {

    try {
        const Ride = new Rides(req.body);

        await Ride.save();
        await res.json(Ride)


    } catch (e) {
        console.log(e);
    }


});
router.get('/Rides', async (req, res) => {


    try {


        const data = await Rides.find()


        res.json(data)

    } catch (e) {
        console.log(e);

    }

})
router.get('/Rides/Completed', async (req, res) => {


    try {


        const data = await Rides.find({status: {$in: ["completed", "cancelled"]}})


        res.json(data)

    } catch (e) {
        console.log(e);

    }

})
router.patch('/Rides/Status', async (req, res) => {

    try {
        const ride = await Rides.findByIdAndUpdate(req.query.id, req.body, { new: true})

        res.json(ride)

    } catch (e) {
        console.log("e");
    }

})
module.exports = router
