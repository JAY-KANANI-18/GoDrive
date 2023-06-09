const Login = require("../../model/login")

class loginController {

    static registerUser =  async (req, res) => {


        try {
          const user = new Login(req.body)
          const token = await user.generateAuthToken()
          await user.save()
          res.status(201).send({ user, token })
      
        } catch (e) {
          res.status(400).send(e)
        }
      
      }

    static loginUser = async (req, res) => {
        console.log('workinggggg');
        try {
          console.log('User login succesfully');
      
          const user = await Login.findByCredentials(req.body.email, req.body.password)
          const token = await user.generateAuthToken()
      
      
          res.send({ user, token })
        } catch (e) {
          console.log('galat aya');
          // res.status(400).send("tako")
        }
      }

    static checkAuthentication =  async (req, res) => {

        try {
      
          res.send(true)
        }
        catch (e) {
          console.log(e);
        }
      
      }



}

module.exports = loginController;
