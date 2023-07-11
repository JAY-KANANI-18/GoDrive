// const stripe = require("stripe")(
//   "sk_test_51N2piRJAU9zBfSBOhszeL5HWLkSKstapCQzk6dbn4ZUjR8xBLPYZPP64VvIUJEACl5COj23WPMpTMBjD400xVSzi00q0Ayujkw"
// );
const Driver = require("../../model/driver");
const Ride = require("../../model/rides");

let stripe_secret_key;

let stripe;

async function UpdateSettingsofDriver() {
  const settings = require("../settings/settings");
  settingData = await settings();
  stripe_secret_key = settingData.stripe_secret_key;

  stripe = require("stripe")(stripe_secret_key);
}
UpdateSettingsofDriver();
class driversController {
  static addNewDriver = async (req, res) => {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError.message });
    }
    if (req.file) {
      req.body.profile = req.file.filename;
    } else {
      req.body.profile = "default.jpeg";
    }

    try {
      const customer = await stripe.customers.create({ email: req.body.email });
      req.body["stripeid"] = customer.id;

      const bankAccount = await stripe.customers.createSource(customer.id, {
        source: {
          object: "bank_account",
          country: "US",
          currency: "usd",
          account_holder_name: "John Doe",
          account_holder_type: "individual",
          routing_number: "110000000",
          account_number: "000999999991",
        },
      });

      const driver = new Driver(req.body);

      await driver.save();
      await res.status(200).send({ msg: "Driver Added Successfully", driver });

    } catch (e) {
      console.log(e);
      let errors = { msg: "Something Went Wrong" };

      if (e.keyPattern?.email && e.keyValue?.email) {
        errors.email = "email already exist";
      } else if (e.keyPattern?.mobile && e.keyValue) {
        errors.number = "number already exist";
      }
      res.status(400).send(errors);
    }
  };

  static getAllAddedDrivrsandSearch = async (req, res) => {
    let regext;
    let data;

    let sortCriteria = {};
    const currentPage = +req.query.page || 1;
    const limits = +req.query.size || 3;

    try {
      if (req.query.field !== undefined) {
        const field = req.query.field;
        sortCriteria[field] = 1;
      } else {
        sortCriteria = { createdAt: -1 };
      }

      let pipeline = [
        {
          $lookup: {
            from: "countries",
            localField: "country",
            foreignField: "_id",
            as: "country",
          },
        },
        {
          $unwind: "$country",
        },
        {
          $lookup: {
            from: "zones",
            localField: "city",
            foreignField: "_id",
            as: "city",
          },
        },
        {
          $unwind: "$city",
        },
        {
          $lookup: {
            from: "vehicles",
            localField: "vehicle",
            foreignField: "_id",
            as: "vehicle",
          },
        },

        {
          $facet: {
            documents: [
              { $match: {} },

              {
                $skip: (currentPage - 1) * limits,
              },
              {
                $limit: limits,
              },
              {
                $sort: sortCriteria,
              },
            ],
            count: [{ $count: "total" }],
          },
        },
      ];

      if (req.query.str) {
        const str = req.query.str.trim();
        regext = new RegExp(str, "i");
        pipeline.splice(5, 0, {
          $match: {
            $or: [
              // {_id: new mongoose.Types.ObjectId(str)},
              { name: regext },
              { mobile: regext },
              { email: regext },
              { "country.name": regext },
              { "city.city": regext },
              { "vehicle.name": regext },
            ],
          },
        });
      }

      data = await Driver.aggregate(pipeline);
      if (data[0]?.count.length === 0) {
        console.log('wwwwwwwwwwwwww');
        throw Error("drivers list not found")

      }

      let totalCounts = data[0]?.count[0]?.total;

      const pages = Math.ceil(totalCounts / limits);

      res.status(200).send({
        msg: "Driver's list Found",
        count: totalCounts,
        drivers: data[0].documents,
        pages,
      });
    } catch (error) {
      if (error.message === "drivers list not found") {

        res.status(400).send({ msg: error.message })
      } else {


        res.status(400).send({ msg: 'Something went Wrong' })
      }
    }
  };

  static deleteDriver = async (req, res) => {
    try {
      let user = await Driver.findOneAndRemove({ _id: req.params.id });

      res.status(200).send({ msg: 'Driver Deleted Successfully' });
    } catch (e) {
      console.log(e);
      res.status(400).send({ msg: 'Something Went Wrong' });
    }
  };

  static getDriverFromId = async (req, res) => {
    try {

      let driver = await Driver.findById(req.query.id);

      if (!driver) {
        throw Error("Driver Not Found")
      }

      res.status(200).send({ driver, msg: "Driver's Details Found" });
    } catch (e) {

      if (error.message === "Driver Not Found") {

        res.status(400).send({ msg: error.message })
      } else {


        res.status(400).send({ msg: 'Something went Wrong' })
      }


    }
  };

  static getApprovedDriver = async (req, res) => {
    try {
      const driver = await Driver.findByIdAndUpdate(req.query.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!driver) {
        throw Error("Driver Not Found")
      }
      res.status(200).send({ driver, msg: "Approval Updated" });
    } catch (e) {
      if (error.message === "Driver Not Found") {

        res.status(400).send({ msg: error.message })
      } else {


        res.status(400).send({ msg: 'Something went Wrong' })
      }
    }
  };

  static getOnlineDriver = async (req, res) => {

    try {


      const data = await Driver.find({ status: 1, vehicle: req.body.vehicle._id, approval: 1 });
      if (data.length === 0) {
        throw Error("Driver's list Not Found")
      }

      res.status(200).send({ msg: "Driver's list Found", data });
    } catch (e) {

      console.log(e);
      if (e.message === "Driver's list Not Found") {

        res.status(400).send({ msg: e.message })
      } else {
        res.status(400).send({ msg: 'Something went Wrong' })
      }
    }
  };

  static SaveUpdatedDetailofDriver = async (req, res) => {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError.message });
    }
    if (req.file) {
      req.body.profile = req.file.filename;
    }

    try {
      // if (!req.body.vehicle) {
      //   req.body.vehicle = null;
      // }
      let driver = await Driver.findByIdAndUpdate(req.query.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!driver) {
        throw Error("Driver Not Found")
      }
      res.status(200).send({ driver, msg: "Driver Updated Successfully" });
    } catch (e) {
      let errors = {};

      if (e.message === "Driver Not Found") {

        res.status(400).send({ msg: error.message })
      } else
        if (e.keyPattern?.email && e.keyValue?.email) {
          errors.email = "email already exist";
        } else if (e.keyPattern?.mobile && e.keyValue) {
          errors.number = "number already exist";
        } else {
          errors.msg = "Something Went Wrong"
        }
      res.status(400).send(errors);
      console.log(e);
    }
  };

  static getRunningRequest = async (req, res) => {
    try {
      const currentPage = req.query.page || 1;
      const limits = req.query.size || 10;
      let pipeline2 = [

        {
          $facet: {
            documents: [
              {
                $skip: (currentPage - 1) * limits, // Skip documents based on the current page
              },
              {
                $limit: limits, // Limit the number of documents per page
              },
              // Retrieve the whole document
            ],
            count: [
              { $count: "total" }, // Count the documents
            ],
          },
        },
      ];
      let pipeline1 = [
        {
          $match: {
            status: {
              $in: [1],
            },
          },
        },

        {
          $lookup: {
            from: "vehicles",
            localField: "vehicle",
            foreignField: "_id",
            as: "vehicle",
          },
        },
        {
          $unwind: "$vehicle",
        },

        {
          $lookup: {
            from: "drivers",
            localField: "driver",
            foreignField: "_id",
            as: "driver",
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            remainingSeconds: {
              $ceil: {
                $divide: [{ $subtract: [new Date(), "$updatedAt"] }, 1000],
              },
            },
          },
        },
      ]

      const data = await Ride.aggregate([...pipeline1, ...pipeline2]);

      if (data[0]?.count.length === 0) {
        res.status(400).send({ msg: "Running Ride's list Not Found" })
        return


      }

      let totalCounts = data[0]?.count[0]?.total;

      const pages = Math.ceil(totalCounts / limits);
      // console.log(pages, data[0].documents.length, limits, pages, data[0]?.count[0].total);

      res.json({
        count: totalCounts,
        rides: data[0].documents,
        pages,
        msg: " Rides's List  Found"

      });

    } catch (error) {
      console.log(error);
      if (error.message === "Running Ride's list Not Found") {

        res.status(400).send({ msg: error.message })
      } else {


        res.status(400).send({ msg: 'Something went Wrong' })
      }
    }
  };
}

module.exports = { driversController, UpdateSettingsofDriver };
