

const pricingController = require('../controllers/routes/pricingController');
const multer = require('multer');
const express = require('express')
const auth = require('../middleware/auth');


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
            const error = ('Please upload a jpg, jpeg, or png');
            error.statusCode = 400; // You can set an appropriate status code
            return cb(error, false);

        }

        cb(null, true);
    }
});

const handleMulterError = (err, req, res, next) => {
    console.log(err);
    if (err instanceof multer.MulterError) {
        // Multer error occurred
        return res.status(400).json({ msg: err.message });
    } else if (err) {
        // Other error occurred
        return res.status(400).json({ msg: err });
    }
    next();
};

const router = new express.Router()






//////------------Countries ----------///////////

router.get("/Pricing/Country", auth, pricingController.getAllAddedCounries)//-------------------->  Get All Added Countries
router.get("/Country", auth, pricingController.getAllCountriesfromModule)//-------------------->  Get Countries Data From npm Module
router.get("/CallingCodes", auth, pricingController.getAllCallingCode)//-------------------->  Get All Countries CallingCode From npm Module
router.post("/Pricing/Country", auth, pricingController.addNewCountry)//-------------------->  Add New Country







//////------------Vehicle Types ----------///////////

router.post("/Pricing/VehicleType", upload.single('file'), handleMulterError, auth,pricingController.addNewVehicleType )//--------------------> Add New Vehicle Type
router.post("/Pricing/Vehicles/Update/save/:id", auth, upload.single('file'),handleMulterError, pricingController.saveUpdatedVehicle)//--------------------> Save Updated Vehicle Tupe
router.get('/Pricing/VehiclesTypes', auth, pricingController.getAllAddedVehicleType)//--------------------> Get All Added Vehicle Types
router.get("/Pricing/Vehicles/Update", auth, pricingController.getVehicleById)//--------------------> Get Vehicle Detail BY Id






//////------------Cities ----------///////////

router.get('/Pricing/City/VehiclesType', auth, pricingController.getAllvehiclesofCity)//--------------------> Get All Vehicle of City Which has Pricing
router.post('/Pricing/City/Save', auth, pricingController.saveUpdatedCity)//--------------------> Save Updated Detail of City
router.get("/Pricing/Cities", auth, pricingController.getCitiesByCountry)//--------------------> Get Cities By Country
router.get('/Pricing/Update/City', auth,pricingController.getCityByID)//--------------------> Get City By Id
router.get("/Pricing/Zone", auth, pricingController.getAddedCities)//--------------------> Get  Added Cities with pagination
router.post("/Pricing/city", auth, pricingController.addNewCity)//--------------------> Add New City
router.post('/findZone', auth,pricingController.findCityByPoint)//--------------------> Find City By Point
router.get('/Pricing/allCities', auth,pricingController.getAddedCitiesAll)//--------------------> Get All Added Cities








//////------------Vehicle Pricing ----------///////////

router.get('/Pricing/Update/VehiclePricing', auth, pricingController.getVehiclePricingByID)//--------------------> Get Vehicle Pricing by Id
router.get('/Pricing/VehiclePricing', auth, pricingController.getPricingofVehicle)//--------------------> Get Vehicle Pricing For Calculation
router.post("/Pricing/VehiclePricing",upload.single(), auth, pricingController.addNewVehiclePricing)//--------------------> Add New Vehicle Pricing
router.get("/Pricing/AllVehiclePricing", auth,pricingController.getAllVehiclePricing)//--------------------> Get All vehicle Pricing
router.post("/Pricing/Save/VehiclePricing",upload.single(), auth,pricingController.saveUpdatedVehiclePricing)//--------------------> Get All vehicle Pricing










module.exports = router
