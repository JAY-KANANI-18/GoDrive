const express = require('express')
const multer = require('multer');
const login = require('./login');
const Login = require('../model/login');
const auth = require('../middleware/auth')


const router = new express.Router()


// const upload = multer({
//   // dest:"avatars",
//   limits: {
//       filesize: 1000000
//   },
//   fileFilter(req, file, cb) {
//       if (!file.originalname.match(/.(jpg|jpeg|png)/)) {
//           return cb(new Error('please upload a jpg , jpeg or png'))
//       }

//       cb(undefined, true)
//   }

// })


// router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {

//   const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()


//   req.user.avatar =   buffer
//   await req.user.save()
//   res.send()

// }, (error, req, res, next) => {
//   res.status(400).send({ "error": error.message })
// })



// router.get("/user/:id/avatar", async (req, res) => {
//   try {
//       const user = await User.findById(req.params.id)

//       if (!user || !user.avatar) {
//           throw new Error()
//       }
//       res.set('Content-Type', 'image/png')
//       res.send(user.avatar)
//       // const avatarData = Buffer.from(user.avatar).toString('base64')
//       // const avatarDataURL = `data:image/jpg;base64,${avatarData}`
//       // res.send(`<img src="${avatarDataURL}"/>`)


//   } catch (e) {
//       res.status(404).send()

//   }
// })




// router.delete('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
//   req.user.avatar = undefined
//   await req.user.save()
//   res.send()

// }, (error, req, res, next) => {
//   res.status(400).send({ "error": error.message })
// })


router.post('/users/login', async (req, res) => {
  try {
    console.log('User login succesfully');

    const user = await Login.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()


    res.send({ user, token })
  } catch (e) {
    console.log('galat aya');
    // res.status(400).send("tako")
  }
})

router.get('/users/loginstatus', auth, async (req, res) => {
  try {
    res.send('success')


  } catch (e) {
    console.log('zara get me hoga error');
    // res.status(400).send("tako")
  }
})

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





router.post('/login', async (req, res) => {


  try {
    const user = new Login(req.body)
    const token = await user.generateAuthToken()
    await user.save()
    res.status(201).send({ user, token })

  } catch (e) {
    res.status(400).send(e)
  }

})
router.get('/auth', auth, async (req, res) => {
  try {

    res.send(true)
  }
  catch (e) {
    console.log(e);
  }

})

// router.get("/users/me", auth, async (req, res) => {

//   res.send(req.user)

// })
// router.get("/users", auth, async (req, res) => {

//   try {
//       const users = await User.find({})
//       if (!users) {
//           return res.status(404).send()
//       }
//       res.send(users)
//   }
//   catch (e) {
//       res.status(500).send(e)
//   }

// })
// // router.get("/users/:id", async (req, res) => {

// //     const _id = req.params.id
// //     try {
// //         const users = await User.find({ _id })
// //         if (!users) {
// //             return res.status(404).send()
// //         }
// //         res.send(users)
// //     }
// //     catch (e) {
// //         res.status(500).send(e)
// //     }



// // })
// router.patch('/users/me', auth, async (req, res) => {
//   const updates = Object.keys(req.body)
//   const allowedUpdates = ['name', 'email', "password", "age"]
//   const isValidOperation = updates.every((update) => {

//       return allowedUpdates.includes(update)
//   })
//   if (!isValidOperation) {
//       return res.status(400).send({ error: 'Invalid update!' })
//   }
//   try {
//       // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//       // const user = await User.findById(req.user)
//       updates.forEach((update) => req.user[update] = req.body[update])

//       await req.user.save()


//       // if (!user) {
//       //     return res.status(404).send()

//       // }
//       res.send(req.user)

//   } catch (e) {
//       res.status(400).send(e)
//   }

// })

// router.delete('/users/me', auth, async (req, res) => {
//   try {
//       // console.log(req.params.id)

//       // const user = await User.findByIdAndDelete(req.params.id)
//       // // console.log(users);

//       // if (!user) {
//       //     return res.status(404).send()

//       // }
//       // console.log(req.user);
//       await req.user.remove()
//       res.send(req.user)
//   } catch (e) {
//       res.status(500).send(e)
//   }
// })



module.exports = router
