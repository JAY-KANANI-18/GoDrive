const express = require("express");

const multer = require("multer");

const Rides = require("../model/rides");
const stripe = require("stripe")(
  "sk_test_51N2piRJAU9zBfSBOhszeL5HWLkSKstapCQzk6dbn4ZUjR8xBLPYZPP64VvIUJEACl5COj23WPMpTMBjD400xVSzi00q0Ayujkw"
);
// const nodemailer = require('nodemailer');
const Sockets = require("../controllers/socket/socket");

const io = Sockets.getIO();

const auth = require("../middleware/auth");
const { addNewRide } = require("../controllers/routes/ridesController");
const ridesController = require("../controllers/routes/ridesController");
const User = require("../model/user");
const { sendMail } = require("../utils/email");
const { sendSMS } = require("../utils/sms");
const VehiclePricing = require("../model/vehiclePricing");
// sendMail().then(result=>console.log('send complete...',result)).catch(error=>console.log(error))

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public/avatars"); // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // specify the file size limit in bytes
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("please upload a jpg , jpeg or png"));
    }

    cb(null, true);
  },
});

const router = new express.Router();

router.post("/addRide", ridesController.addNewRide);

router.get("/Rides", ridesController.getConfirmedRides);

router.get("/Rides/Completed", ridesController.getCompletedRides);

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

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency, customer } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer,
      payment_method_types: ["card"],
      setup_future_usage: "off_session",
    });

    res.send({ client_secret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/attach-payment-method", async (req, res) => {
  try {
    const { paymentMethod, customer } = req.body;

    await stripe.paymentMethods.attach(paymentMethod, {
      customer: "6459e260e318ff85d1c79312",
    });

    await stripe.customers.update(customer, {
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });

    res.send("Payment method attached");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/Rides/Update", async (req, res) => {
  try {
    
    const currentRide = await Rides.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
    });
    let pipeline = [
      {
        $match: {
          _id: currentRide._id
        }

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
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]
    
    const ride = await Rides.aggregate(pipeline)

    
    
    if (ride[0].status == 6) {
      
      await CompleteRIde(ride[0])

      
    }
    res.send({ status: ride[0].status });
  } catch (e) {
    console.log('err');
    res.status(400).send(e)
  }

});


async function CompleteRIde(ride) {

  try{
    const user = await User.findById(ride.user)
    const vehiclepricing = await VehiclePricing.findOne({vehicle:ride.vehicle})

    if(ride.payment_type === 1){

      
      
      let paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round( +ride.ride_fees) * 100,
        currency: "usd",
        payment_method_types: ["card"],
        payment_method: ride.card_detail,
        customer: user.stripeid,
        confirm: true,
      });

      console.log(paymentIntent);
    }
    console.log('completed');
    // io.emit("ride_status_change");
    
    
    // sendMail(user.email, "Welcome", "welcome to Godrive");
    // sendSMS("+917043714531", "welcome to Godrive");
    let html = `<head>
    <title>Bill</title>
    <style>
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid black;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    </style>
    </head>
    <body>
    <p> Your Ride is completed successfully , thank you for use our service</p>

    <p>Here is your, <strong>Bill</strong></p>
    
    <table>
    <tr>
    <th>Vehicle</th>
    <th>Distance(in Km)</th>
    <th>Time(in min)</th>
    <th>Price per distance unit (in $)</th>
    <th>Price per Time unit (in $)</th>
    <th>Total </th>
  </tr>
  <tr>
  <td>${ride.vehicle.name}</td>
  <td>${ride.distance}</td>
  <td>${ride.time}</td>
  <td>${vehiclepricing.priceperunitdistance}</td>
  <td>${vehiclepricing.priceperunittime}</td>
  <td> $${ride.ride_fees}</td>
  
  </tr>
 
  </table>
  </body>`
  
  let email = await sendMail('jaykanani28887@gmail.com', "Welcome", "welcome to Godrive",html);
  let sms = await sendSMS("+917043714531", "Ride is Comleted");
  
}catch(e){
  console.log(e);
}
  
  
}

module.exports = router;
