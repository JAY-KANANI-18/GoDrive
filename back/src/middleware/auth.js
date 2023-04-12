const jwt = require('jsonwebtoken')
const Login = require('../model/login')


const auth = async (req,res,next)=>{
    try{

        // const token = req.header('Authorization').replace('Bearer ','')
        const token = req.header('Authorization')
        console.log(token);
        const decoded = jwt.verify(token,'thisismynewcourse')
        const user = await Login.findOne({_id:decoded._id,'tokens.token':token})
        console.log('user:',user);
        if(!user){
            throw Error('eihiii')
            next()

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
//     next()

// }

module.exports = auth
