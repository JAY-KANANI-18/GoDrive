const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const VehiclePricingSchema = new mongoose.Schema({
  country: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "countries",
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "zones",
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "vehicles",
  },
  driverprofit: {
    type: String,
    require: true,
  },
  distanceforbaseprice: {
    type: String,
    require: true,
  },
  baseprice: {
    type: String,
    require: true,
  },
  minfare: {
    type: String,
    require: true,
  },
  priceperunitdistance: {
    type: String,
    require: true,
  },
  priceperunittime: {
    type: String,
    require: true,
  },
  maxspace: {
    type: String,
    require: true,
  },
},  { timestamps: true }
);

const VehiclePricing = mongoose.model("VehiclePricing", VehiclePricingSchema);

module.exports = VehiclePricing;
