const jwt = require('jsonwebtoken')
const Login = require('../model/login')


const auth = async (req,res,next)=>{
    try{

        const token = req.header('Authorization').replace('Bearer ','')
        // const token = req.header('Authorization')
        const decoded = jwt.verify(token,'thisismynewcourse')
        const user = await Login.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw Error('eihiii')

        }
        req.token = token
        req.user = user

        next()


    }catch(e){
        console.log("plese auth");
        

        res.status(401).send({error:'please authenticate.'})

    }
}







// const auth = async (req,res,next) =>{
//     console.log("auth middleware")
//      ()

// }

module.exports = auth
