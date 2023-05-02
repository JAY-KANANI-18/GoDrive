
const express = require('express')
const multer = require('multer');
const Driver = require('../model/driver');
const Rides = require('../model/rides');










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


router.post("/Drivers", upload.single('file'), async (req, res) => {

    console.log(req.body);
    if (req.file) {
        req.body.avatar = req.file.filename
    } else {
        req.body.avatar = "";
    }

    try {
        const driver = new Driver(req.body);
        // const emails = req.body.email
        // const mobile = req.body.mobile

        // let duplicateE = await User.findOne({ email: emails })
        // let duplicateM = await User.findOne({ mobile: mobile })

        // errors = {}

        // if (duplicateE) errors.error_email = "email already exists"
        // if (duplicateM) errors.error_number = "number already exists"
        // if ((!duplicateE) && (!duplicateM)) {
        await driver.save();
        await res.json(driver)
        // } else {
        //     res.json({ errors })
        // }

    } catch (e) {
        console.log(e);
    }
});


router.get('/Drivers/Delete/:id', async (req, res) => {
    try {
      let   user=  await Driver.findOneAndRemove({ '_id': req.params.id })

        res.send(user)
    } catch (e) {
        console.log(e);

    }
})

router.get('/Drivers/Update/:id', async (req, res) => {
    try {
      let   user=  await Driver.findOneAndRemove({ '_id': req.params.id })

        res.send(user)
    } catch (e) {
        console.log(e);

    }
})

router.patch('/Drivers/Approve', async (req, res) => {

  

    try {


   const driver = await Driver.findOneAndUpdate(req.query.id, req.body, { new: true, runValidators: true })


        
        res.json(driver)

    } catch (e) {
        console.log(e);

    }

})
router.get('/Drivers/Online', async (req, res) => {

    const currentPage = req.query.page || 1;
    const limits = req.query.size
    const str = req.query.str
    const regext = new RegExp(str, "i")

    try {


        const data = await Driver.find({status:'online'})


        res.json(data)

    } catch (e) {
        console.log(e);

    }

})
router.get('/Drivers/CurrentRide', async (req, res) => {

    try {


        const data = await Driver.find({})
        console.log(data);


        res.json(data)

    } catch (e) {
        console.log(e);

    }

})
router.get('/Drivers', async (req, res) => {

    const currentPage = req.query.page || 1;
    const limits = req.query.size
    const str = req.query.str
    const regext = new RegExp(str, "i")

    try {


        // const totalUser = await Drivers.find({ $or: [{ name: { $regex: regext } }, { mobile: { $regex: regext } }, { email: { $regex: regext } }, { country: { $regex: regext } }], }).count()
        const data = await Driver.find({ $or: [{ name: { $regex: regext } }, { mobile: { $regex: regext } }, { email: { $regex: regext } }, { country: { $regex: regext } }], })


        // let user = { data, totalUser, limits }
        res.json(data)

    } catch (e) {
        console.log(e);

    }

})

module.exports = router
