const mongoose = require("mongoose")
mongoose.set('strictQuery', true)



const VehiclePricingSchema = new mongoose.Schema({
    country: {
        type:String,
        require: true
    }, city: {
        type:String,
        require: true

    }
    , vehicle: {
        type: String,
        require: true

    }, driverprofit: {
        type:String,
        require: true

    }
    , distanceforbaseprice: {
        type:String,
        require: true

    }
    , baseprice: {
        type:String,
        require: true

    }
    , minfare: {
        type:String,
        require: true

    }
    , priceperunitdistance: {
        type:String,
        require: true

    }
    ,priceperunittime: {
        type:String,
        require: true

    }
    ,
    maxspace: {
        type:String,
        require: true

    }
    




});



const VehiclePricing = mongoose.model('VehiclePricing', VehiclePricingSchema)

module.exports = VehiclePricing;


