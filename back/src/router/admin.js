// // SERVER SIDE

const express = require('express')
const User = require('../model/user')
const Vehicle = require('../model/vehicle')
const multer = require('multer');
const ct = require('countries-and-timezones');
const Country = require('../model/country')
const Zone = require('../model/zone')
const VehiclePricing = require('../model/vehiclePricing')
const Driver = require('../model/driver')
const Rides = require("../model/rides")

// const countryData = require('country-data');
// const countries = countryData.countries.all;





// const countriesObject = {};
// const allCountries = []
// for (const country of countries) {



//     const countryName = country.name
//     const tz = ct.getCountry(country.alpha2)
//     const newTZ = ct.getTimezone(tz?.timezones[0]);
//     const countryObject = {
//         name: country.name,
//         currency: country.currencies[0],
//         callingcode: country.countryCallingCodes[0],
//         flag: country.emoji,
//         timezone: "UTC " + newTZ?.dstOffsetStr,
//         countrycode: country.alpha3
//     };
//     // console.log(newTZ?.dstOffsetStr);

//     // countriesObject.timezone=newTZ
//     // console.log(countrys?.timezones[0]);





//     allCountries.push(countryName)
//     countriesObject[countryName] = countryObject;
// }
// // console.log(countries);





const router = new express.Router()

// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, 'public/avatars')     // './public/images/' directory name where save the file
//     },
//     limits: {
//         fileSize: 1000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/.(png)/)) {
//             return cb(new Error('please upload a jpg , jpeg or png'))
//         }

//         cb(undefined, true)
//     },
//     filename: (req, file, callBack) => {
//         callBack(null, file.fieldname + '-' + Date.now() + file.originalname)
//     }
// })

// const upload = multer({ storage: storage });

async function jay(){

    const zone = await Zone.find({},{city:1 ,_id:0})
    const allzones = []

    zone.forEach((each)=>{
       allzones.push( each.city.zone)
       function isPointInPolygon(point, polygon) {
           let inside = false;
           let x = point[0], y = point[1];
           

           for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
               let xi = polygon[i].lat, yi = polygon[i].lng;
               let xj = polygon[j].lat, yj = polygon[j].lng;
               let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
               if (intersect) inside = !inside;
            }
            
            return inside;
        }
        
        // /lat: 40.7127753, lng: -74.0059728}

// {
//     "lat": 22.572646,
//     "lng": 88.36389500000001
// }


            const point = [  22.572646, 88.36389500000001];
            const polygon =each.city.zone
            
            if (isPointInPolygon(point, polygon)) {
                console.log("The point is inside the polygon.");
                return each.city.name
            } else {
                console.log("The point is outside the polygon.");
            }
        })
      

}
// const raj = jay()
// console.log(raj);

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

// Then use the `upload` middleware for the route where you want to handle file uploads


// router.get('/allZone', async (req, res) => {

    

//     try {

//         const zone = await Zone.find({},{city:1 ,_id:0})
//         res.json(zone)

//     } catch (e) {
//         console.log(e);

//     }






// })

// router.get("/getCountry", async (req, res) => {



//     try {
//         res.json({ allCountries, countriesObject })

//     } catch (e) {
//         console.log(e);
//     }



// })



// router.get("/zone", async (req, res) => {


//     try {
//         const zones = await Zone.find()

//         await res.send(zones)


//     } catch (e) {
//         console.log(e);
//     }



// })




// router.post("/addNewVehicle", upload.single('file'), async (req, res) => {


//     if (req.file) {
//         req.body.file = req.file.filename
//     } else {
//         req.body.file = "";

//     }






//     try {
//         const vehicle = new Vehicle(req.body);

//         await vehicle.save();




//         await res.json(vehicle)


//     } catch (e) {

//         if (e.keyPattern && e.keyValue) {
//             res.status(400).send({ msg: "Vehicle Type Already Exist", e })
//         }


//         res.status(400).send("takotako", e)

//     }


// });

// router.post("/addZone", async (req, res) => {


//     try {
//         const zone = new Zone(req.body);

//         await zone.save();
//         await res.json(zone)


//     } catch (e) {
//         console.log(e);
//     }


// });
// router.post("/addRide", async (req, res) => {
//     console.log(req.body);

//     try {
//         const Ride = new Rides(req.body);

//         await Ride.save();
//         await res.json(Ride)


//     } catch (e) {
//         console.log(e);
//     }


// });
// router.post("/addVehiclePricing", async (req, res) => {

//     console.log(req.body);
//     try {
//         const vp = new VehiclePricing(req.body);

//         await vp.save();
//         await res.json(vp)


//     } catch (e) {
//         console.log(e);
//     }


// });



// router.post("/addCountry", async (req, res) => {


//     // if (req.file) {
//     //     req.body.file = req.file.filename
//     // } else {
//     //     req.body.file = "";
//     // }
//     console.log(req.body);





//     try {
//         const country = new Country(req.body);

//         await country.save();




//         await res.json(country)


//     } catch (e) {
//         console.log(e);
//     }


// });


// router.post("/Vehicles/Update/save/:id", upload.single('file'), async (req, res) => {
//     console.log(req.body);
//     if (req.file) {
//         req.body.file = req.file.filename
//     }



//     const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
//     console.log(vehicle);
//     try {
//         await vehicle.save()
//         res.json(vehicle)

//     } catch (e) {
//         console.log(e);
//     }




// });

// router.get("/Vehicles", upload.single('file'), async (req, res) => {

//     try {
//         const vehicle = await Vehicle.find()

//         await res.send(vehicle)


//     } catch (e) {
//         console.log(e);
//     }
// });

// router.get("/getAddedCountry", async (req, res) => {

//     try {
//         const country = await Country.find()



//         await res.send(country)


//     } catch (e) {
//         console.log(e);
//     }
// });
// router.get("/VehiclesType", async (req, res) => {

//     try {
//         const country = await Vehicle.find({}, { name: 1, _id: 0 })

//         await res.send(country)


//     } catch (e) {
//         console.log(e);
//     }
// });
// router.get("/Cities", async (req, res) => {

//     try {
//         const city = await Zone.find({}, { _id: 0 })
//         await res.send(city)


//     } catch (e) {
//         console.log(e);
//     }
// });

// router.get("/Vehicles/Delete/:id", upload.single('file'), async (req, res) => {
//     console.log(req.params.id);

//     try {
//         await Vehicle.findByIdAndDelete(req.params.id)

//         res.send("success delete")

//     } catch (e) {
//         console.log(e);
//     }
// });
// router.get("/Country/Delete/:id", async (req, res) => {
//     console.log(req.params.id);

//     try {
//         let country = await Country.findByIdAndDelete(req.params.id)

//         res.send(country)

//     } catch (e) {
//         console.log("e");
//     }
// });

// router.get("/Vehicles/Update/:id", async (req, res) => {


//     try {
//         const vehicle = await Vehicle.findById(req.params.id)

//         await res.status(200).json(vehicle)


//     } catch (e) {
//         console.log(e);
//     }
// });





// router.get('/Users', async (req, res) => {

//     const currentPage = req.query.page || 1;
//     const limits = req.query.size
//     const str = req.query.str
//     const regext = new RegExp(str, "i")

//     try {


//         const totalUser = await User.find({ $or: [{ name: { $regex: regext } }, { mobile: { $regex: regext } }, { email: { $regex: regext } }, { country: { $regex: regext } }], }).count()
//         const data = await User.find({ $or: [{ name: { $regex: regext } }, { mobile: { $regex: regext } }, { email: { $regex: regext } }, { country: { $regex: regext } }], })


//         let user = { data, totalUser, limits }
//         console.log(data);
//         res.json(data)

//     } catch (e) {
//         console.log(e);

//     }

// })

// router.get('/Drivers', async (req, res) => {

//     const currentPage = req.query.page || 1;
//     const limits = req.query.size
//     const str = req.query.str
//     const regext = new RegExp(str, "i")

//     try {


//         // const totalUser = await Drivers.find({ $or: [{ name: { $regex: regext } }, { mobile: { $regex: regext } }, { email: { $regex: regext } }, { country: { $regex: regext } }], }).count()
//         const data = await Driver.find({ $or: [{ name: { $regex: regext } }, { mobile: { $regex: regext } }, { email: { $regex: regext } }, { country: { $regex: regext } }], })


//         // let user = { data, totalUser, limits }
//         res.json(data)

//     } catch (e) {
//         console.log(e);

//     }

// })
// router.get('/VehiclePricing', async (req, res) => {




//     const zone = await VehiclePricing.find({
        
//     })
//     console.log(zone);


//     try {



//     } catch (e) {
//         console.log(e);

//     }

// })





// router.get('/Users/Delete/:id', async (req, res) => {
//     try {
//         await User.findOneAndRemove({ '_id': req.params.id })

//         res.send("sucessfully delete")
//     } catch (e) {
//         console.log(e);

//     }
// })
// router.post('/User/Data', async (req, res) => {
//     console.log(req.body);
//     try {

//         let user = await User.findOne({ mobile: req.body.number })
//         console.log(user);
//         if (!user) {
//             return
//         }
//         res.send(user)
//     } catch (e) {
//         console.log(e);

//     }
// })


// router.get('/Users/Update/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)

//         await res.status(200).json(user)


//     } catch (e) {
//         console.log(e);
//     }
// })
// router.post("/Users", upload.single('file'), async (req, res) => {

//     if (req.file) {
//         req.body.avatar = req.file.filename
//     } else {
//         req.body.avatar = "";
//     }

//     try {
//         const user = new User(req.body);
//         // const emails = req.body.email
//         // const mobile = req.body.mobile

//         // let duplicateE = await User.findOne({ email: emails })
//         // let duplicateM = await User.findOne({ mobile: mobile })

//         // errors = {}

//         // if (duplicateE) errors.error_email = "email already exists"
//         // if (duplicateM) errors.error_number = "number already exists"
//         // if ((!duplicateE) && (!duplicateM)) {
//         await user.save();
//         await res.json(user)
//         // } else {
//         //     res.json({ errors })
//         // }

//     } catch (e) {

//         errors = {

//         }

//         if (e.keyPattern.email && e.keyValue.email) {


//             errors.email = "email already exist"
//         } else if (e.keyPattern.mobile && e.keyValue) {
//             errors.number = "number already exist"

//         }
//         res.status(400).send(errors)

//     }
// });
// router.post("/Drivers", upload.single('file'), async (req, res) => {

//     console.log(req.body);
//     if (req.file) {
//         req.body.avatar = req.file.filename
//     } else {
//         req.body.avatar = "";
//     }

//     try {
//         const driver = new Driver(req.body);
//         // const emails = req.body.email
//         // const mobile = req.body.mobile

//         // let duplicateE = await User.findOne({ email: emails })
//         // let duplicateM = await User.findOne({ mobile: mobile })

//         // errors = {}

//         // if (duplicateE) errors.error_email = "email already exists"
//         // if (duplicateM) errors.error_number = "number already exists"
//         // if ((!duplicateE) && (!duplicateM)) {
//         await driver.save();
//         await res.json(driver)
//         // } else {
//         //     res.json({ errors })
//         // }

//     } catch (e) {
//         console.log(e);
//     }
// });



module.exports = router
