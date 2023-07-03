const express = require("express");
const auth = require("../middleware/auth");

const settingsController = require("../controllers/routes/settingsController");
const router = new express.Router();

router.patch("/Settings/edit",auth, settingsController.editSettings);

router.get("/Settings",auth, settingsController.getSettings);

module.exports = router;
