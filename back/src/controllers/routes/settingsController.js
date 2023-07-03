const Settings = require("../../model/settings");
const { UpdateSettingsofEmail } = require("../../utils/email");
const { UpdateSettingsofSMS } = require("../../utils/sms");
const { getSettingData } = require("../cronjob/crone");
const { UpdateSettingsofDriver } = require("./driversController");
const { UpdateSettingsofUser } = require("./usersController");

class settingsController {
  static editSettings = async (req, res) => {
    console.log(req.query);
    console.log(req.body);

    try {
      const setting = await Settings.findByIdAndUpdate(req.query.id, req.body);

      if(!setting){
        res.status(400).send({msg:"Setting data Not Found"})
      }

      getSettingData()
      // UpdateSettingsofUser()
      UpdateSettingsofDriver()
      UpdateSettingsofSMS()
      UpdateSettingsofEmail()

      await res.json({setting,msg:"Setting's Updated Successfully"});
    } catch (e) {
      res.status(400).send({msg:"Something Went Wrong"})
      
      console.log(e);
    }
  };

  static getSettings = async (req, res) => {
    console.log("work");

    try {
      const setting = await Settings.findOne({});
      if(!setting){
        await res.status(400).send({msg:"Setting Data Not Found"});

      }
      await res.status(200).send({setting,msg:"Setting Data Found"});
    } catch (e) {
      res.status(400).send({msg:"Something Went Wrong"})

      console.log(e);
    }
  };
}
module.exports = settingsController;
