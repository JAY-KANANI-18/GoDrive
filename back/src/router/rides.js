

const express = require('express')

const multer = require('multer');

const Rides = require("../model/rides")
const stripe = require('stripe')('sk_test_51N45EpSAETG1lrtoCyIOrQBKsC40rN9TDa0itbl4qp1wSRLOPqzmdoqc7B1oLcRgN6PB172qHLTHQAfJSVbbQTvV007T3DL57i');
// const nodemailer = require('nodemailer');
const Sockets = require('../controllers/socket/socket')


const io = Sockets.getIO();


const auth = require('../middleware/auth');
const { addNewRide } = require('../controllers/routes/ridesController');
const ridesController = require('../controllers/routes/ridesController');

// sendMail().then(result=>console.log('send complete...',result)).catch(error=>console.log(error))


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


router.post("/addRide", ridesController.addNewRide);

router.get('/Rides',ridesController.getConfirmedRides )


router.get('/Rides/Completed',ridesController.getCompletedRides)




router.get("/Rides/Payment", async (req, res) => {
    const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, customer } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer,
            payment_method_types: ['card'],
            setup_future_usage: 'off_session',
        });

        res.send({ client_secret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/attach-payment-method', async (req, res) => {
    try {
        const { paymentMethod, customer } = req.body;


        await stripe.paymentMethods.attach(paymentMethod, {
            customer: '6459e260e318ff85d1c79312',
        });

        await stripe.customers.update(customer, {
            invoice_settings: {
                default_payment_method: paymentMethod,
            },
        });

        res.send('Payment method attached');
    } catch (err) {
        res.status(500).send(err);
    }
});

router.patch('/Rides/Accepted/Status',async(req,res)=>{


    const ride = await Rides.findByIdAndUpdate(req.query.id,req.body,{new:true})

io.emit('ride_status_change')
    res.send({status:ride.status})
})



module.exports = router
