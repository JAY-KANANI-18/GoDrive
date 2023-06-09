const Country = require("../../model/country");

const countryData = require('country-data');
const ct = require('countries-and-timezones');
const Vehicle = require("../../model/vehicle");
const VehiclePricing = require("../../model/vehiclePricing");
const Zone = require("../../model/zone");
const mongoose = require("mongoose")



class pricingController {

    //--------------- Methods For Countries -------------// 

    static getAllCountriesfromModule = async (req, res) => {


        try {
            res.json({ allCountries, countriesObject })

        } catch (e) {
            console.log(e);
        }



    }

    static getAllCallingCode = async (req, res) => {


        try {
            res.json(allCollingCodes)

        } catch (e) {
            console.log(e);
        }



    }

    static addNewCountry = async (req, res) => {



        try {
            const country = new Country(req.body);

            await country.save();




            await res.json(country)


        } catch (e) {
            console.log(e);
        }


    }

    static getAllAddedCounries = async (req, res) => {

        try {
            const country = await Country.find()



            await res.send(country)


        } catch (e) {
            console.log(e);
        }
    }

    static deleteCountry = async (req, res) => {

        try {
            let country = await Country.findByIdAndDelete(req.params.id)

            res.send(country)

        } catch (e) {
            console.log(e);
        }
    }

    static searchCountry = async (req, res) => {

        const str = req.query.str
        const regext = new RegExp(str, "i")

        try {


            const data = await Country.find({ name: { $regex: regext } })


            res.json(data)

        } catch (e) {
            console.log(e);

        }

    }

    //--------------- Methods For Vehicle Type -------------// 

    static addNewVehicleType = async (req, res) => {
        console.log(req);
        if (req.fileValidationError) {
            console.log('ayayayy');
            return res.status(400).json({ error: req.fileValidationError.message });
        }
        if (req.file) {
            req.body.file = req.file.filename
        } else {
            req.body.file = "";

        }


        try {
            const vehicle = new Vehicle(req.body);

            await vehicle.save();




            await res.json(vehicle)


        } catch (e) {
            console.log(e);

            if (e.keyPattern && e.keyValue) {
                res.status(400).send({ msg: "Vehicle Type Already Exist", e })
            }


            // res.status(400).send("takotako", e)
            res.status(500).send("takotako", e)

        }


    }

    static getAllAddedVehicleType = async (req, res) => {

        try {
            const country = await Vehicle.find({})

            await res.send(country)


        } catch (e) {
            console.log(e);
        }
    }

    static getVehicleById = async (req, res) => {


        try {
            const vehicle = await Vehicle.findById(req.query.id)

            await res.status(200).json(vehicle)


        } catch (e) {
            console.log(e);
        }
    }

    static saveUpdatedVehicle = async (req, res) => {
        if (req.file) {
            req.body.file = req.file.filename
        }



        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        try {
            await vehicle.save()
            res.json(vehicle)

        } catch (e) {
            console.log(e);
        }




    }

    static deleteVehicle = async (req, res) => {
        console.log('workkk');
        try {
            await Vehicle.findByIdAndDelete(req.params.id)

            res.send({ msg: "success delete" })

        } catch (e) {
            console.log(e);
        }
    }

    //--------------- Methods For Vehicle Pricing -------------// 

    static addNewVehiclePricing = async (req, res) => {

        try {
            const vp = new VehiclePricing(req.body);

            await vp.save();
            await res.json(vp)


        } catch (e) {
            console.log(e);
        }


    }

    static getPricingofVehicle = async (req, res) => {


        let city = req.query.city
        let type = req.query.type
        const zone = await VehiclePricing.findOne({ city: city, vehicle: type })


        try {

            res.status(200).send(zone)

        } catch (e) {
            console.log(e);

        }

    }

    static getVehiclePricingByID = async (req, res) => {



        try {

            const vp = await VehiclePricing.findById({ _id: req.query.id })
            res.json(vp)

        } catch (e) {
            console.log(e);

        }






    }
    static getAllVehiclePricing = async (req, res) => {

        let regext;
        let data
        let sortCriteria

        const currentPage = req.query.page || 1;
        const limits = req.query.size || 3


        try {




            let pipeline = [
                {
                    $lookup: {
                        from: 'countries', // Name of the SUV collection
                        localField: 'country',
                        foreignField: '_id',
                        as: 'country'
                    }
                }, {
                    $unwind: '$country'
                },
                {
                    $lookup: {
                        from: 'zones', // Name of the SUV collection
                        localField: 'city',
                        foreignField: '_id',
                        as: 'city'
                    }
                },
                {
                    $unwind: '$city'
                },
                {
                    $lookup: {
                        from: 'vehicles', // Name of the SUV collection
                        localField: 'vehicle',
                        foreignField: '_id',
                        as: 'vehicle'
                    }
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
                            { $count: "total" } // Count the documents
                        ]
                    }
                },


            ]




            if (req.query.str) {
                console.log('aya su krew che', req.query.str);
                const str = req.query.str
                console.log(str, 'aala');
                regext = new RegExp(str, "i")
                pipeline.splice(6, 0, {
                    $match: {
                        $or: [
                            // {_id: new mongoose.Types.ObjectId(str)},
                            { "country.name": regext },
                            { "city.city": regext },
                            { "vehicle.name": regext },
                  
                        ]


                    }
                })

            }
            console.log('woo');
            data = await VehiclePricing.aggregate(pipeline)

            let totalCounts = data[0]?.count[0]?.total


            const pages = Math.ceil(totalCounts / limits)



            res.json({
                count: totalCounts,
                pricings: data[0].documents,
                pages

            })






        } catch (e) {
            console.log(e);
            res.status(400).send(e)
        }



    }

    static deletePricingofVehicle = async (req, res) => {

        try {
            const vp = await VehiclePricing.findByIdAndDelete(req.query.id)

            res.status(200).send(vp)

        } catch (e) {
            res.status(400).send(e)
        }
    }

    static getAllvehiclesofCity = async (req, res) => {



        try {
            let city = req.query.city
            const zone = await VehiclePricing.aggregate([
                {
                    $match: {
                        city: new mongoose.Types.ObjectId(city)
                    }
                }, {
                    $lookup: {
                        from: 'vehicles', // Name of the SUV collection
                        localField: 'vehicle',
                        foreignField: '_id',
                        as: 'vehicle'
                    }
                },
                {
                    $unwind: '$vehicle'
                }, {
                    $project: {
                        vehicle: 1
                    }
                }

            ])


            res.status(200).send(zone)

        } catch (e) {
            console.log(e);

        }

    }

    //--------------- Methods For Cities -------------// 

    static addNewCity = async (req, res) => {


        try {
            const zone = new Zone(req.body);

            await zone.save();
            await res.json(zone)


        } catch (e) {
            errors = {

            }

            if (e.keyPattern?.city && e.keyValue?.city) {
                console.log('in city err');


                errors.city = "city already exist"
            }
            res.status(400).send(errors)
            console.log(e);

        }


    }

    static getCityByID = async (req, res) => {



        try {

            const zone = await Zone.findById({ _id: req.query.id })
            res.status(200).json(zone)

        } catch (e) {
            res.status(400).json(e)

        }






    }

    static findCityByPoint = async (req, res) => {
        try {
            let obb = { lat: req.body.lat, lng: req.body.lng }
            let citya
            const vp = await Zone.find({})
            vp.forEach((each) => {
                let city = isPointInPolygon(obb, each)
                if (city) {
                    citya = city

                    return
                }


            })

            function isPointInPolygon(point, polygona) {
                let polygon = polygona.zone
                var i, j = polygon.length - 1;
                for (i = 0; i < polygon.length; i++) {
                    var xi = polygon[i].lng, yi = polygon[i].lat;
                    var xj = polygon[j].lng, yj = polygon[j].lat;
                    var intersect = ((yi > point.lat) != (yj > point.lat))
                        && (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
                    if (intersect) {
                        // let city = polygona._id
                        // console.log(city);
                        return polygona

                    } else {
                    }
                }

            }

            res.json(citya)

        } catch (e) {
            console.log(e);

        }




    }

    static saveUpdatedCity = async (req, res) => {

        const city = await Zone.findByIdAndUpdate(req.query.id, req.body, { new: true, runValidators: true })
        try {
            await city.save()
            res.json(city)

        } catch (e) {
            res.send(e)
        }






    }

    static getAddedCities = async (req, res) => {
        let regext;
        let data
        let sortCriteria




        const currentPage = req.query.page || 1;
        const limits = req.query.size || 3

        console.log(currentPage, limits);


        try {




            let pipeline = [

                {
                    $facet: {
                        documents: [
                            { $match: {} },
                            {
                                $lookup: {
                                    from: 'countries',
                                    localField: 'country',
                                    foreignField: '_id',
                                    as: 'country'
                                }
                            },
                            {
                                $unwind: '$country'
                            },
                            {
                                $skip: (currentPage - 1) * limits, // Skip documents based on the current page
                            },
                            {
                                $limit: limits, // Limit the number of documents per page
                            },
                            // Retrieve the whole document
                        ],
                        count: [
                            { $count: "total" } // Count the documents
                        ]
                    }
                },


            ]

            if (req.query.str) {
                const str = req.query.str
                regext = new RegExp(str, "i")
                pipeline.unshift({
                    $match: {
                        $or: [
                            // {_id: new mongoose.Types.ObjectId(str)},
                            { $expr: { $regexMatch: { input: "$country.name", regex: regext } } },
                            { city: regext },
                        ]


                    }
                })

                // data = await Zone.aggregate(pipeline)

            }
            data = await Zone.aggregate(pipeline)



            let totalCounts = data[0]?.count[0]?.total


            const pages = Math.ceil(totalCounts / limits)



            res.json({
                count: totalCounts,
                cities: data[0]?.documents,
                pages

            })

        } catch (e) {
            console.log(e);
        }



    }

    static getCitiesByCountry = async (req, res) => {
        let cities = []

        try {
            const data = await Zone.find({ country: req.query.country })
            // data.forEach(element => {
            //     cities.push(element.city)

            // });

            await res.send(data)


        } catch (e) {
            console.log(e);
        }
    }

    static deleteCity = async (req, res) => {

        try {
            const zone = await Zone.findByIdAndDelete(req.query.id)

            res.status(200).send(zone)

        } catch (e) {
            res.status(400).send(e)
        }
    }

}



const allCollingCodes = countryData.callingCodes.all
const countriesObject = {};
const allCountries = []
const countries = countryData.countries.all;

for (const country of countries) {



    const countryName = country.name
    const tz = ct.getCountry(country.alpha2)
    const newTZ = ct.getTimezone(tz?.timezones[0]);
    const countryObject = {
        name: country.name,
        currency: country.currencies[0],
        callingcode: country.countryCallingCodes[0],
        flag: country.emoji,
        timezone: "UTC " + newTZ?.dstOffsetStr,
        countrycode: country.alpha3
    };






    allCountries.push(countryName)
    countriesObject[countryName] = countryObject;
}
module.exports = pricingController;
