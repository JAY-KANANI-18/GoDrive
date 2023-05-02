
const express = require('express')
const Vehicle = require('../model/vehicle')
const multer = require('multer');
const ct = require('countries-and-timezones');
const Country = require('../model/country')
const Zone = require('../model/zone')
const VehiclePricing = require('../model/vehiclePricing')

const countryData = require('country-data');
const countries = countryData.countries.all;



const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/avatars'); // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // specify the file size limit in bytes
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('please upload a jpg , jpeg or png'));
        }

        cb(null, true);
    }
});


const router = new express.Router()

const allCollingCodes = countryData.callingCodes.all
const countriesObject = {};
const allCountries = []
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
    // console.log(newTZ?.dstOffsetStr);

    // countriesObject.timezone=newTZ
    // console.log(countrys?.timezones[0]);





    allCountries.push(countryName)
    countriesObject[countryName] = countryObject;
}
// console.log(countries);






router.get("/Country", async (req, res) => {


    try {
        res.json({ allCountries, countriesObject })

    } catch (e) {
        console.log(e);
    }



})


router.get("/CallingCodes", async (req, res) => {


    try {
        res.json(allCollingCodes)

    } catch (e) {
        console.log(e);
    }



})

router.post("/Pricing/Country", async (req, res) => {



    try {
        const country = new Country(req.body);

        await country.save();




        await res.json(country)


    } catch (e) {
        console.log(e);
    }


});
router.get('/Pricing/VehiclePricing', async (req, res) => {


    let city = req.query.city
    let type = req.query.type
    console.log(city);
    const zone = await VehiclePricing.findOne({ city: city ,vehicle:type})


    try {

        res.status(200).send(zone)

    } catch (e) {
        console.log(e);

    }

})
router.get('/Pricing/City/VehiclesType', async (req, res) => {



    let city = req.query.city
    const zone = await VehiclePricing.find({ city: city })
    console.log(zone);

    vehicleTypes = []
    zone.forEach(type => {
        vehicleTypes.push(type.vehicle)
    });


    try {

        res.status(200).send(vehicleTypes)

    } catch (e) {
        console.log(e);

    }

})
router.get('/Pricing/VehiclesTypes', async (req, res) => {



    const zone = await Vehicle.find()


    try {

        res.status(200).send(zone)

    } catch (e) {
        console.log(e);

    }

})


router.get("/Pricing/Country", async (req, res) => {

    try {
        const country = await Country.find()



        await res.send(country)


    } catch (e) {
        console.log(e);
    }
});


router.get("/Pricing/Country/Delete/:id", async (req, res) => {
    console.log(req.params.id);

        try {
            let country = await Country.findByIdAndDelete(req.params.id)

            res.send(country)

        } catch (e) {
            console.log("e");
        }
});

router.get('/Pricing/Search/Country', async (req, res) => {

    const str = req.query.str
    console.log(str);
    const regext = new RegExp(str, "i")

    try {


        const data = await Country.find({ name: { $regex: regext } })


        res.json(data)

    } catch (e) {
        console.log(e);

    }

})
router.get("/Pricing/Vehicles/Update/:id", async (req, res) => {


    try {
        const vehicle = await Vehicle.findById(req.params.id)

        await res.status(200).json(vehicle)


    } catch (e) {
        console.log(e);
    }
});
router.get("/Pricing/VehiclesType", async (req, res) => {

    try {
        const country = await Vehicle.find({}, { name: 1, _id: 0 })

        await res.send(country)


    } catch (e) {
        console.log(e);
    }
});
router.post("/Pricing/city", async (req, res) => {


    try {
        const zone = new Zone(req.body);

        await zone.save();
        await res.json(zone)


    } catch (e) {
        console.log(e);
    }


});
router.get("/Pricing/Cities", async (req, res) => {
    console.log(req.query.country);
    let cities = []

    try {
        const data = await Zone.find({country:req.query.country})
            data.forEach(element => {
                cities.push(element.city.name)
                
            });

        await res.send(cities)


    } catch (e) {
        console.log(e);
    }
});

router.get("/Pricing/Vehicles/Delete/:id", upload.single('file'), async (req, res) => {
    console.log(req.params.id);

    try {
        await Vehicle.findByIdAndDelete(req.params.id)

        res.send("success delete")

    } catch (e) {
        console.log(e);
    }
});
router.get("/Pricing/City/Delete", async (req, res) => {

    try {
       const zone =  await Zone.findByIdAndDelete(req.query.id)

        res.status(200).send(zone)

    } catch (e) {
        res.status(400).send(e)
    }
});
router.get("/Pricing/VehiclePricing/Delete", async (req, res) => {

    try {
       const vp =  await VehiclePricing.findByIdAndDelete(req.query.id)

        res.status(200).send(vp)

    } catch (e) {
        res.status(400).send(e)
    }
});

router.post("/Pricing/Vehicles/Update/save/:id", upload.single('file'), async (req, res) => {
    console.log(req.body);
    if (req.file) {
        req.body.file = req.file.filename
    }



    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    console.log(vehicle);
    try {
        await vehicle.save()
        res.json(vehicle)

    } catch (e) {
        console.log(e);
    }




});

router.get("/Pricing/Vehicles", upload.single('file'), async (req, res) => {

    try {
        const vehicle = await Vehicle.find()

        await res.send(vehicle)


    } catch (e) {
        console.log(e);
    }
});
router.post("/Pricing/VehiclePricing", async (req, res) => {

    console.log(req.body);
    try {
        const vp = new VehiclePricing(req.body);

        await vp.save();
        await res.json(vp)


    } catch (e) {
        console.log(e);
    }


});


router.get("/Pricing/Zone", async (req, res) => {


    try {
        const zones = await Zone.find()

        await res.send(zones)


    } catch (e) {
        console.log(e);
    }



})

router.get("/Pricing/AllVehiclePricing", async (req, res) => {


    try {
        const data = await VehiclePricing.find()

        res.status(200).send(data)


    } catch (e) {
        res.status(400).send(e)
    }



})




router.post("/Pricing/VehicleType", upload.single('file'), async (req, res) => {


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

        if (e.keyPattern && e.keyValue) {
            res.status(400).send({ msg: "Vehicle Type Already Exist", e })
        }


        res.status(400).send("takotako", e)

    }


});

router.get('/Pricing/allZone', async (req, res) => {



    try {

        const zone = await Zone.find({}, { city: 1, _id: 0 })
        res.json(zone)

    } catch (e) {
        console.log(e);

    }






})
router.get('/Pricing/Update/City', async (req, res) => {



    try {

        const zone = await Zone.findById({_id:req.query.id})
        res.status(200).json(zone)

    } catch (e) {
        res.status(400).json(e)

    }






})
router.get('/Pricing/Update/VehiclePricing', async (req, res) => {



    try {

        const vp = await VehiclePricing.findById({_id:req.query.id})
        res.json(vp)

    } catch (e) {
        console.log(e);

    }






})
router.post('/Pricing/City/Save', async (req, res) => {
    // console.log(req.query.id);

    console.log(req.body);



    const city = await Zone.findByIdAndUpdate(req.query.id, req.body, { new: true, runValidators: true })
    try {
        await city.save()
        res.json(city)

    } catch (e) {
        console.log(e);
    }






})








module.exports = router
