const mongoose = require("mongoose")
mongoose.set('strictQuery', true)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const VehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase:true,
        unique:true,
        required: true,
        trim: true,
        

    },file: {
        type:String,
        required: true,

    }

   

});



// LoginSchema.methods.generateAuthToken = async function () {
//   const user = this
//   // const token = jwt.sign({_id:user._id.toString()},'thisismynewcourse',{expiresIn:'30 seconds'})
//   const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
//   user.tokens = user.tokens.concat({ token })
//   await user.save()
//   return token
// }


// LoginSchema.statics.findByCredentials = async (email, password) => {
//   const user = await Login.findOne({ email })
//   if (!user) {
//       throw new Error('Unable to login')
      
//     }
    
//     const isMatch = await bcrypt.compare(password, user.password)
//   if (!isMatch) {
//       throw new Error('Unable to login')
//   }
//   return user
// }
// delete user task when user removed
// LoginSchema.pre('remove', async function (next) {
//   const user = this
//   await Task.deleteMany({ owner: user._id })
//   next()
// })

// LoginSchema.pre('save', async function (next) {
//   const user = this
//   if (user.isModified('password')) {
//       user.password = await bcrypt.hash(user.password, 8)
//   }
//   next()
// })






const Vehicle = mongoose.model('Vehicle', VehicleSchema)

module.exports = Vehicle;


