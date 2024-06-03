const express = require("express");
const multer = require("multer");






const auth = require("../middleware/auth");
const usersController = require("../controllers/routes/usersController").usersController;

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "../public/avatars"); // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // specify the file size limit in bytes
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      const error = "Please upload a jpg, jpeg, or png";
      error.statusCode = 400; // You can set an appropriate status code
      return cb(error, false);
    }

    cb(null, true);
  },
});

const handleMulterError = (err, req, res, next) => {
  console.log(err);
  if (err instanceof multer.MulterError) {
    // Multer error occurred
    return res.status(400).json({ msg: err.message });
  } else if (err) {
    // Other error occurred
    return res.status(500).json({ msg: err });
  }
  next();
};

const router = new express.Router();

router.post(
  "/Users/Update/Save",
  upload.single("avatar"),
  handleMulterError,
  auth,
  usersController.saveUpdatedUser
); //----------> Save Updated Detail of USer

router.post(
  "/Users",
  upload.single("avatar"),
  handleMulterError,
  auth,
  usersController.addUser
); //--------------------> Add New User

router.get("/Users/Cards/default", auth, usersController.setDefaultCard); //----------------------> Set Users Default Card

router.get("/Users/Update", auth, usersController.getDetailForUpdate); //------------------------> Get User Detail for Upadte

router.get("/Users/Payment", auth, usersController.getPaymentFromUser); //------------------------> Get Payment of Ride Form User

router.get("/Users/Cards/delete", auth, usersController.deleteCard); //------------------------> Delete Card of User

router.get("/Users/Delete/:id", auth, usersController.deleteUser); //------------------------> Delete User


router.get("/Users/Cards", auth, usersController.getUserCards); //------------------------> Get All Added Card of User

router.post("/User/Data", auth, usersController.getAddedUser); //------------------------> Get Detail of User For Create Ride

router.post("/User/Card", auth, usersController.addUserCard); //------------------------> Add Card in User

router.get("/Users", auth, usersController.getUsers); //------------------------> Get All Added Usewer

module.exports = router;
