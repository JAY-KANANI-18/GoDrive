const mongoose = require("mongoose")
mongoose.set('strictQuery', true)



const ZoneSchema = new mongoose.Schema({
    country: {
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'countries'
    },city:{
        type:Object,
        required:true,
        unique:true,

    },zone:{
        type:Array,
        required:true,
        unique:true,
    }
    
});

ZoneSchema.index({ country: 1, city: 1 }, { unique: true });


const Zone = mongoose.model('Zone', ZoneSchema)

module.exports = Zone;


