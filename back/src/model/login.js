const mongoose = require("mongoose")
mongoose.set('strictQuery', true)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        // trim: true,

    },

    email: {
        type: String,
        // required: true,
        // trim: true,
        // lowercase: true,
        // unique: true,
        // validate(value) {

        //     if (!validator.isEmail(value)) {
        //         throw new Error("Email is not valid")
        //     }

        // }

    },

    password: {
        type: String,
        // default: 'default.jpeg'
    }, tokens: [{
      token: {
          type: String,
          required: true
      }

  }]

});



LoginSchema.methods.generateAuthToken = async function () {
  const user = this
  // const token = jwt.sign({_id:user._id.toString()},'thisismynewcourse',{expiresIn:'30 seconds'})
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}


LoginSchema.statics.findByCredentials = async (email, password) => {
  const user = await Login.findOne({ email })
  console.log(user);
  if (!user) {
      throw new Error('Unable to login')
      
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
      throw new Error('Unable to login')
  }
  return user
}
// delete user task when user removed
// LoginSchema.pre('remove', async function (next) {
//   const user = this
//   await Task.deleteMany({ owner: user._id })
//   next()
// })

LoginSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})






const Login = mongoose.model('Login', LoginSchema)

module.exports = Login;


