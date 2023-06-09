
const express = require('express')
const cronService = require('../controllers/cronjob/crone')
const auth = require('../middleware/auth')


const Settings = require('../model/settings')
const settingsController = require('../controllers/routes/settingsController')
const router = new express.Router()

router.patch("/Settings/edit", settingsController.editSettings);

router.get("/Settings", settingsController.getSettings);



module.exports = router


