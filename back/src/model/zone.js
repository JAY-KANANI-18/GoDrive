const mongoose = require("mongoose")
mongoose.set('strictQuery', true)



const ZoneSchema = new mongoose.Schema({
    country: {
        type: String,
        require:true
    },city:{
        type:Object,
        require:true

    }
    

   

});



const Zone = mongoose.model('Zone', ZoneSchema)

module.exports = Zone;


