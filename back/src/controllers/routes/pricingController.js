const Country = require("../../model/country");

const countryData = require("country-data");
const ct = require("countries-and-timezones");
const Vehicle = require("../../model/vehicle");
const VehiclePricing = require("../../model/vehiclePricing");
const Zone = require("../../model/zone");
const mongoose = require("mongoose");

class pricingController {
  //--------------- Methods For Countries -------------//

  static getAllCountriesfromModule = async (req, res) => {
    try {

     
      if(allCountries.length == 0 ||countriesObject.length == 0){
        res.status(400).send({msg:"Can't get Countries Data"});
        return
      }

      res.status(200).send({msg:'Data Found', allCountries, countriesObject });
    } catch (e) {
    res.status(400).send({msg:"Something Went Wrong"})
      console.log(e);
    }
  };

  static getAllCallingCode = async (req, res) => {
    try {


         
      if(allCollingCodes.length == 0 ){
        res.status(400).send({msg:"Can't get CallingCodes"});
        return
      }
      res.status(200).send({allCollingCodes,msg:'Calling Code Found'});
    } catch (e) {
      res.status(400).send({msg:"Something Went Wrong"})

      console.log(e);
    }
  };

  static addNewCountry = async (req, res) => {
    try {
      const country = new Country(req.body);

      await country.save();

      await res.status(200).send({msg:"Country Added Successfully",country});
    } catch (e) {
      res.status(400).send({msg:"Something Went Wrong"})

      console.log(e);
    }
  };

  static getAllAddedCounries = async (req, res) => {
    try {
      const country = await Country.find();

      if(country.length === 0){
        res.status(400).send({msg:"Added Country's List Not Found"})
        return
      }

      await res.send({country,msg:"Get Added Country's List"});
    } catch (e) {
      res.status(400).send({msg:"Something Went Wrong"})

      console.log(e);
    }
  };

 

  //--------------- Methods For Vehicle Type -------------//

  static addNewVehicleType = async (req, res) => {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError.message });
    }
    if (req.file) {
      req.body.file = req.file.filename;
    } else {
      req.body.file = "";
    }

    try {
      const vehicle = new Vehicle(req.body);

      await vehicle.save();

      await res.json(vehicle);
    } catch (e) {
      console.log(e);

      if (e.keyPattern && e.keyValue) {
        res.status(400).send({ msg: "Vehicle Type Already Exist", e });
      }else{

        res.status(400).send({msg:"Something Went Wrong"});
      }

    }
  };

  static getAllAddedVehicleType = async (req, res) => {
    try {
      const vehicle = await Vehicle.find({});


      if(vehicle.length === 0){
        res.status(400).send({msg:"Added Vehicle's List Not Found"})
        return
      }

      await res.status(200).send({msg:"Added Vehicle's List Found",vehicle});
    } catch (e) {
      res.status(400).send({msg:"Something Went Wrong"})

      console.log(e);
    }
  };

  static getVehicleById = async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.query.id);



      if(!vehicle){
        res.status(400).send({msg:"Vehicle's Data Not Found"})
        return
      }


      await res.status(200).json({vehicle,msg:"Vehicle's Data Found"});
    } catch (e) {
      console.log(e);
      res.status(400).send({msg:"Something Went Wrong"})

    }
  };

  static saveUpdatedVehicle = async (req, res) => {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError.message });
    }
    if (req.file) {
      req.body.file = req.file.filename;
    }
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });




      if(!vehicle){
        res.status(400).send({msg:"Vehicle Not Found"})
        return
      }

      await vehicle.save();
      res.status(200).send({vehicle,msg:"Vehicle's Deatils Updated"});
    } catch (e) {
      if (e.keyPattern && e.keyValue) {
        res.status(400).send({ msg: "Vehicle Type Already Exist", e });
      }else{

        res.status(400).send({msg:"Something Wenmt Wrong"});
      }

    }
  };



  //--------------- Methods For Vehicle Pricing -------------//

  static addNewVehiclePricing = async (req, res) => {
    console.log(req.body);
    try {
      const vp = new VehiclePricing(req.body);


      let error = {}


      const duplicatevp = await VehiclePricing.aggregate([{

        $match: {
          city: new mongoose.Types.ObjectId(req.body.city),
          vehicle: new mongoose.Types.ObjectId(req.body.vehicle)

        }
      }])
      console.log(duplicatevp);

      if (duplicatevp.length > 0) {
        console.log('duplicate');
        error['msg'] = 'Vehicle Pricing already exist'
        res.status(404).send(error)
      } else {



        await vp.save();
        await res.status(200).json({msg:"Pricing Added Succefully",vp});
      }
    } catch (e) {
      res.status(400).send({msg:"Something Went Wrong"})

      console.log(e);
    }
  };

  static getPricingofVehicle = async (req, res) => {
    let city = req.query.city;
    let type = req.query.type;
    try {
    const pricing = await VehiclePricing.findOne({ city: city, vehicle: type });




    if(!pricing){
      res.status(400).send({msg:"Pricing's Details Not Found"})
      return
    }


      res.status(200).send({pricing,msg:"Pricing's Details Found"});
    } catch (e) {
      res.status(400).send({msg:"Something Went Wrong"})

      console.log(e);
    }
  };

  static getVehiclePricingByID = async (req, res) => {
    let pipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(req.query.id) }
      },
      {
        $lookup: {
          from: "countries", // Name of the SUV collection
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
          from: "zones", // Name of the SUV collection
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
          from: "vehicles", // Name of the SUV collection
          localField: "vehicle",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      {
        $unwind: {
          path: "$vehicle",
          // preserveNullAndEmptyArrays: true,
        },
      },

    ];
    try {
      const vp = await VehiclePricing.aggregate(pipeline);

      if(vp.length===0){
        res.status(400).send({msg:"Pricing's Data Not Found"})
        return
      }
      res.status(200).send({pricing:vp[0],msg:"Pricing's Data Found"});
    } catch (e) {
      res.status(400).send({msg:"Something Went Wrong"})

      console.log(e);
    }
  };
  static getAllVehiclePricing = async (req, res) => {
    let regext;
    let data;
    let sortCriteria;

    const currentPage = req.query.page || 1;
    const limits = req.query.size || 3;

    try {
      let pipeline = [
        {
          $lookup: {
            from: "countries", // Name of the SUV collection
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
            from: "zones", // Name of the SUV collection
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
            from: "vehicles", // Name of the SUV collection
            localField: "vehicle",
            foreignField: "_id",
            as: "vehicle",
          },
        },
        {
          $unwind: {
            path: "$vehicle",
            // preserveNullAndEmptyArrays: true,
          },
        },

        {
          $facet: {
            documents: [
              // { $match: {} },

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

      if (req.query.str) {
        console.log("aya su krew che", req.query.str);
        const str = req.query.str;
        console.log(str, "aala");
        regext = new RegExp(str, "i");
        pipeline.splice(6, 0, {
          $match: {
            $or: [
              // {_id: new mongoose.Types.ObjectId(str)},
              { "country.name": regext },
              { "city.city": regext },
              { "vehicle.name": regext },
            ],
          },
        });
      }
      data = await VehiclePricing.aggregate(pipeline);

      let totalCounts = data[0]?.count[0]?.total;
      if(data[0]?.count.length ===0){
        console.log(true);
        res.status(400).send({msg:"Pricing's Not List Found"
})
        return
      }

      const pages = Math.ceil(totalCounts / limits);

      res.status(200).send({
        count: totalCounts,
        pricings: data[0].documents,
        pages,
        msg:"Pricing's List Found"
      });
    } catch (e) {
      console.log(e);
      res.status(400).send({msg:"Something Went Wrong"});
    }
  };


  static getAllvehiclesofCity = async (req, res) => {
    try {

      console.log(req.query);
      let city = req.query.city;
      const vehicle = await VehiclePricing.aggregate([
        {
          $match: {
            city: new mongoose.Types.ObjectId(city),
          },
        },
        {
          $lookup: {
            from: "vehicles", // Name of the SUV collection
            localField: "vehicle",
            foreignField: "_id",
            as: "vehicle",
          },
        },
        {
          $unwind: "$vehicle",
        },
        {
          $project: {
            vehicle: 1,
          },
        },
      ]);

      if(vehicle.length===0){
        res.status(400).send({msg:"Vehicle Not Found In City"})
        return
      }

      res.status(200).send({vehicle,msg:'Vehicle Found In City'});
    } catch (e) {
      console.log(e);
      res.status(400).send({msg:"Something Went Wrong"})

    }
  };
  static saveUpdatedVehiclePricing = async (req, res) => {

    try {
      const pricing = await VehiclePricing.findByIdAndUpdate(
        req.query.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if(!pricing){
        res.status(400).send({msg:"Pricing Not Found"})
        return
      }

      
      await pricing.save();
      res.status(200).send({pricing,msg:"Pricing's Details Updated"});
    } catch (e) {
      res.status(400).send({msg:"Something Went Wrong"});

      console.log(e);
    }
  };

  //--------------- Methods For Cities -------------//

  static addNewCity = async (req, res) => {
    try {
      const zone = new Zone(req.body);

      await zone.save();
      await res.status(200).send(zone);
    } catch (e) {
      let errors = {msg:'Something Went Wrong'};

      if (e.keyPattern?.city && e.keyValue?.city) {

        errors.city = "city already exist";
      }
      res.status(400).send(errors);
    }
  };

  static getCityByID = async (req, res) => {
    try {
      console.log(req.query.id);
      const zone = await Zone.aggregate([
        {
          $lookup: {
            from: "countries", // Name of the SUV collection
            localField: "country",
            foreignField: "_id",
            as: "country",
          },
        },
        {
          $unwind: "$country",
        },
        { $match: { _id: new mongoose.Types.ObjectId(req.query.id) } },

      ]);

      if(zone.length === 0){
        res.status(400).send({msg:"City's Details Not Found"})
        return
      }

      console.log(zone, 'anjmsj');
      res.status(200).send({msg:"City's Details Found",city:zone[0]});
    } catch (e) {
      console.log(e);
      res.status(400).send({msg:'Something Went Wrong'});
    }
  };

  static findCityByPoint = async (req, res) => {
    try {
      let point = { lat: req.body.lat, lng: req.body.lng };
      let citya;
      const vp = await Zone.find({});

      for (let i = 0; i < vp.length; i++) {
        if (findCityWithPoint(point, vp[i])) {
          return res.status(200).send({city:vp[i],msg:'City Found At Your Location'});
        }
      }
      return res.status(400).send({ msg: "City Not Found" });

      function findCityWithPoint(point, zone) {
        var intersectCount = 0;
        var i, j;

        for (i = 0, j = zone.zone.length - 1; i < zone.zone.length; j = i++) {
          var xi = zone.zone[i].lng, yi = zone.zone[i].lat;
          var xj = zone.zone[j].lng, yj = zone.zone[j].lat;
          if (((yi > point.lat) != (yj > point.lat)) && (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi)) {
            intersectCount++;
          }
        }
        return (intersectCount % 2 == 1);
      }
    } catch (e) {
      res.status(400).send({msg:'Something Went Wrong'});

      console.log(e);
    }
  };

  static saveUpdatedCity = async (req, res) => {
    try {
      const city = await Zone.findByIdAndUpdate(req.query.id, req.body, {
        new: true,
        runValidators: true,
      });

      if(!city){
        res.status(400).send({msg:"City's Details Not Found for save"})
        return
      }
      await city.save();
      res.status(200).send({city,msg:"City's Details Updated"});
    } catch (e) {
      let errors = { msg:"Something Went Wrong"};

      if (e.keyPattern?.city && e.keyValue?.city) {
        errors.city = "city already exist";
      }
      res.status(400).send(errors);
      // console.log(e);
    }
  };

  static getAddedCities = async (req, res) => {
    let regext;
    let data;
    let sortCriteria;


    const currentPage = req.query.page || 1;
    const limits = req.query.size || 3;

    console.log(currentPage, limits);

    try {
      let pipeline = [
        {
          $facet: {
            documents: [
              { $match: {} },
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
                $skip: (currentPage - 1) * limits, 
              },
              {
                $limit: limits, 
              },
            ],
            count: [
              { $count: "total" }, 
            ],
          },
        },
      ];



      if (req.query.str) {
        const str = req.query.str;
        regext = new RegExp(str, "i");
        pipeline.unshift({
          $match: {
            $or: [
              // {_id: new mongoose.Types.ObjectId(str)},
              {
                $expr: {
                  $regexMatch: { input: "$country.name", regex: regext },
                },
              },
              { city: regext },
            ],
          },
        });

        // data = await Zone.aggregate(pipeline)
      }
      data = await Zone.aggregate(pipeline);


      if(data[0]?.count.length === 0){
        res.status(400).send({msg:"Cities List Not Found"})
        return
      }

      let totalCounts = data[0]?.count[0]?.total;

      const pages = Math.ceil(totalCounts / limits);

      res.status(200).send({
        count: totalCounts,
        cities: data[0]?.documents,
        pages,
        msg:'Cities List Found'
      });
    } catch (e) {
      console.log(e);
      res.status(400).send({msg:'Something Went Wrong'});

    }
  };

  static getCitiesByCountry = async (req, res) => {
    let cities = [];

    try {
      const city = await Zone.find({ country: req.query.country });
      if(city.length === 0){
        res.status(400).send({msg:"Country's Cities  Not Found"})
        return
      }

      await res.status(200).send({city,msg:"Country's Cities Found"});
    } catch (e) {
      console.log(e);
      res.status(400).send({msg:"Something Went Wrong"})
    }
  };



  static getAddedCitiesAll = async (req, res) => {

    try {
      let cities = await Zone.aggregate([{
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "_id",
          as: "country",
        },
      },
      {
        $unwind: "$country",
      },])


      if(cities.length === 0){
        res.status(400).send({msg:"all City's list Not Found"})
        return
      }
      res.status(200).send({ msg: 'get all Cities Successfully', data: cities })
    } catch (e) {
      res.status(400).send({ msg: 'City Not Found' })

    }

  }
}

let allCollingCodes = countryData.callingCodes.all;
let countriesObject = {};
let allCountries = [];
let countries = countryData.countries.all;

for (const country of countries) {
  const countryName = country.name;
  const tz = ct.getCountry(country.alpha2);
  const newTZ = ct.getTimezone(tz?.timezones[0]);
  const countryObject = {
    name: country.name,
    currency: country.currencies[0],
    callingcode: country.countryCallingCodes[0],
    flag: country.emoji,
    timezone: "UTC " + newTZ?.dstOffsetStr,
    countrycode: country.alpha3,
  };

  allCountries.push(countryName);
  countriesObject[countryName] = countryObject;
}
module.exports = pricingController;
