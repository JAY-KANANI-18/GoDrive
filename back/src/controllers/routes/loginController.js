const Login = require("../../model/login");

class loginController {
  static registerUser = async (req, res) => {
    try {
      const user = new Login(req.body);
      const token = await user.generateAuthToken();
      await user.save();
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  };

  static loginUser = async (req, res) => {
    try {

      const user = await Login.findByCredentials(
        req.body.email,
        req.body.password
      );
      const token = await user.generateAuthToken();
      console.log(user, "sjdj");

      res.send({ user, token, msg: 'login Successfully' });
    } catch (e) {
      res.status(401).send({ message: e.message, msg: 'Something Went Wrong' });
    }
  };

  static checkAuthentication = async (req, res) => {
    try {
      res.send(true);
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  };

  static LogOutUserasync = async (req, res) => {
    try {
      console.log(req.body, 'hahahaahah');
      let user = await Login.findById(req.body.user)
      if (user) {

        user.tokens = user.tokens.filter((token) => {
          return token.token !== req.body.token
        })
        await user.save()
        res.status(200).send({ msg: 'Logout Successfully' })
      }
      else{
        res.status(400).send({ msg: 'User Not Found' })
        
      }


    } catch (e) {
      console.log(e);
      res.status(500).send()
    }
  };
}

module.exports = loginController;
