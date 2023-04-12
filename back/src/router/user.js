// // SERVER SIDE

// const express = require('express')
// const User = require('../model/user')
// const multer = require('multer');




// const router = new express.Router()

// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, 'public/avatars')     // './public/images/' directory name where save the file
//     },
//     limits: {
//         fileSize: 100000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/.(png)/)) {
//             return cb(new Error('please upload a jpg , jpeg or png'))
//         }

//         cb(undefined, true)
//     },
//     filename: (req, file, callBack) => {
//         callBack(null, file.fieldname + '-' + Date.now() + file.originalname)
//     }
// })

// const upload = multer({ storage: storage });



// router.get('/home', async (req, res) => {
//     try {
//         res.render('home')

//     } catch (e) {
//         console.log("ERROR IN RENDER HOME PAGE");
//     }
// })


// router.post("/home", upload.single('avatar'), async (req, res) => {

//     if (req.file) {
//         req.body.avatar = req.file.filename
//     } else {
//         req.body.avatar = "";
//     }

//     try {
//         const user = new User(req.body);
//         const emails = req.body.email
//         const mobile = req.body.mobile

//         let duplicateE = await User.findOne({ email: emails })
//         let duplicateM = await User.findOne({ mobile: mobile })

//         errors = {}

//         if (duplicateE) errors.error_email = "email already exists"
//         if (duplicateM) errors.error_number = "number already exists"
//         if ((!duplicateE) && (!duplicateM)) {
//             await user.save();
//             await res.json(user)
//         } else {
//             res.json({ errors })
//         }

//     } catch (e) {
//         console.log(e);
//     }
// });



// router.get('/show', async (req, res) => {

//     const currentPage = req.query.page || 1;
//     const limits = req.query.size
//     const str = req.query.str
//     const regext = new RegExp(str, "i")

//     try {


//         const totalUser = await User.find({ $or: [{ name: { $regex: regext } }, { mobile: { $regex: regext } }, { email: { $regex: regext } }, { country: { $regex: regext } }], }).count()
//         const data = await User.find({ $or: [{ name: { $regex: regext } }, { mobile: { $regex: regext } }, { email: { $regex: regext } }, { country: { $regex: regext } }], }).skip((currentPage - 1) * limits).limit(limits).sort({ name: -1 })


//         let user = { data, totalUser, limits }
//         res.json(user)

//     } catch (e) {
//         console.log(e);

//     }

// })


// router.delete('/delete/:id', async (req, res) => {
//     try {
//         await User.findOneAndRemove({ '_id': req.params.id })

//         res.send("sucessfully delete")
//     } catch (e) {
//         console.log(e);

//     }
// })


// router.patch('/update', upload.single('avatar'), async (req, res) => {

//     if (req.file) {
//         req.body.avatar = req.file.filename
//     } else {
//         req.body.avatar = "";
//     }

//     const user = await User.findByIdAndUpdate(req.query.id, req.body, { new: true, runValidators: true })

//     try {
//         await user.save()
//         res.json(user)

//     } catch (e) {
//         console.log(e);
//     }

// })


// module.exports = router
