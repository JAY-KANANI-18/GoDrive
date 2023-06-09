const Settings = require("../../model/settings");
const cronService = require('../cronjob/crone')

class settingsController {

    static editSettings = async (req, res) => {
        console.log(req.query);
        console.log(req.body);
    
        try {
            const country = await Settings.findByIdAndUpdate(req.query.id,req.body);
            cronService.getSettingData()
            await res.json(country)
    
    
        } catch (e) {
            console.log(e);
        }
    
    }

    static getSettings = async (req, res) => {
        console.log('work');
    
        try {
            const setting = await Settings.findOne({});
            await res.json(setting)
    
    
        } catch (e) {
            console.log(e);
        }
    
    }
}
module.exports = settingsController;
