const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  currency: {
    type: String,
  },
  flag: {
    type: String,
  },
  callingcode: {
    type: String,
  },
  timezone: {
    type: String,
  },
  countrycode: {
    type: String,
  },
});

const Country = mongoose.model("Country", CountrySchema);

module.exports = Country;
