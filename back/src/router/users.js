
const express = require('express')
const User = require('../model/user')
const multer = require('multer');





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


router.get('/Users/Delete/:id', async (req, res) => {
    try {
      let   user=  await User.findOneAndRemove({ '_id': req.params.id })

        res.send(user)
    } catch (e) {
        console.log(e);

    }
})
router.post('/User/Data', async (req, res) => {
    console.log(req.body);
    try {

        let user = await User.findOne({ mobile: req.body.number })
        console.log(user);
        if (!user) {
            res.send(user)

            return
        }
        res.send(user)
    } catch (e) {
        console.log(e);

    }
})


router.get('/Users/Update/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        await res.status(200).json(user)


    } catch (e) {
        console.log(e);
    }
})
router.post("/Users", upload.single('file'), async (req, res) => {

    if (req.file) {
        req.body.avatar = req.file.filename
    } else {
        req.body.avatar = "default.jpeg";
    }

    try {
        const user = new User(req.body);
        // const emails = req.body.email
        // const mobile = req.body.mobile

        // let duplicateE = await User.findOne({ email: emails })
        // let duplicateM = await User.findOne({ mobile: mobile })

        // errors = {}

        // if (duplicateE) errors.error_email = "email already exists"
        // if (duplicateM) errors.error_number = "number already exists"
        // if ((!duplicateE) && (!duplicateM)) {
        await user.save();
        await res.json(user)
        // } else {
        //     res.json({ errors })
        // }

    } catch (e) {

        errors = {

        }

        if (e.keyPattern.email && e.keyValue.email) {


            errors.email = "email already exist"
        } else if (e.keyPattern.mobile && e.keyValue) {
            errors.number = "number already exist"

        }
        res.status(400).send(errors)

    }
});
router.get('/Users', async (req, res) => {

    const currentPage = req.query.page || 1;
    const limits = req.query.size
    const str = req.query.str
    const regext = new RegExp(str, "i")

    try {


        const totalUser = await User.find({ $or: [{ name: { $regex: regext } }, { mobile: { $regex: regext } }, { email: { $regex: regext } }, { country: { $regex: regext } }], }).count()
        const data = await User.find({ $or: [{ name: { $regex: regext } }, { mobile: { $regex: regext } }, { email: { $regex: regext } }, { country: { $regex: regext } }], })


        let user = { data, totalUser, limits }
        console.log(data);
        res.json(data)

    } catch (e) {
        console.log(e);

    }

})
module.exports = router
