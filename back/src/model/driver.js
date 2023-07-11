const mongoose = require("mongoose");
const validator = require("validator");

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,    },

    mobile: {
      type: String,
      required: true,
      trim: true,
      unique:true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "vehicles",
    },
    acceptride: {
      type: String,
      default: "yes",
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      // validate(value) {

      //     if (!validator.isEmail(value)) {
      //         throw new Error("Email is not valid")
      //     }

      // }
    },
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
    profile: {
      type: String,
      default: "default.jpeg",
    },
    approval: {
      type: Number,
      enum: [0, 1, 2],
    },
    status: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3], //----> 0 : offline ----> 1 : online ----> 2:hold ----> 3:onride
    },
    currentride: {
      type: mongoose.Schema.Types.ObjectId,
      // default: 'none'
    },
    stripeid: {
      type: String,
    },
  },
  { timestamps: true ,validateBeforeSave: true }

);

const Driver = mongoose.model("Driver", DriverSchema);

module.exports = Driver;
