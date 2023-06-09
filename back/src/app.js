// server side

const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const Driver = require("./model/driver");
const Ride = require("./model/rides");

const loginRouter = require("../src/router/login");
const https = require("http");
const Sockets = require('./controllers/socket/socket')
const fs = require('fs');


const app = express();


const privateKey = fs.readFileSync('../localhost.key', 'utf8');
const certificate = fs.readFileSync('../localhost.csr', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
};


const server = https.createServer(credentials,app);

// const io = require("socket.io")(server);

// module.exports = {
//   io:io
// }

// Sockets.socket(io)
Sockets.initialize(server);


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/GoDrive");



const publicDiractoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDiractoryPath));




const adminRouter = require("../src/router/admin");
const pricingRouter = require("../src/router/pricing");
const ridesRouter = require("../src/router/rides");
const usersRouter = require("../src/router/users");
const driversRouter = require("../src/router/drivers");
const SettingsRouter = require("../src/router/settings");

app.use(adminRouter);
app.use(loginRouter);
app.use(ridesRouter);
app.use(usersRouter);
app.use(driversRouter);
app.use(pricingRouter);
app.use(SettingsRouter);

const ServerStartTime = new Date()





// app.use(express.static(publicDiractoryPath))
// app.use(userRouter)

// app.use(cookieParser());



// async function rideaccepted(driver, ride) {

//   let rideobj = {
//     status: 'accepted',
//     driver: driver.name
//   }
//   let driverobj = {
//     status: 'busy',
//     currentride: ride

//   }



//   const nride = await Ride.findByIdAndUpdate(ride._id, rideobj, {
//     new: true,
//     runValidators: true,
//   });
//   const ndriver = await Driver.findByIdAndUpdate(driver._id, driverobj, {
//     new: true,
//     runValidators: true,
//   });

//   io.emit('ride_status_change', { ride: nride, driver: ndriver })
//   io.emit('driver_status_change', { driver: ndriver, ride: nride })


// }
// async function changedriverstatus(driver, status) {

//   console.log(driver,status);
//   let driverobj = {
//     status
//   }

//   const ndriver = await Driver.findByIdAndUpdate(driver._id, driverobj, {
//     new: true,
//     runValidators: true,
//   });
//   io.emit('driver_status_change', { driver: ndriver })


// }
// async function changeRideStatus(ride,driver){
//   console.log('in func');

//   io.emit('ride_status_change',{ ride, driver })

// }


// async function autoAssign(ride) {

//   const drivers = await Driver.find({
//     status: "online",
//     vehicle: ride.vehicle,
//     approval: "approved",
//   });

//   for (const driver of drivers) {
//     changedriverstatus(driver, "busy")
//     const cdriver = await Driver.findById(driver._id);

//     if (cdriver.status == "busy") {
//       continue
//     }
//     console.log(cdriver.status);


//     const response = await new Promise((resolve) => {
//       const intervalId = setTimeout(() => {
//         if (driver.acceptride == "yes") {
//           rideaccepted(driver, ride)
//           clearTimeout(intervalId);
//           resolve("accepted");
//         } else {
//           console.log(driver.name);
//           resolve("next");
//           changedriverstatus(driver, "online")


//         }
//       }, 2000);
//     });

//     if (response === "accepted") {
//       console.log("accepted");
//       return;
//     }




//   }
//   io.emit('notification', 'Driver not found')

// }

// const cronFunc = async () => {
//   let CurrentDriver
//   let CurrentDrivers
//   let newDetails
//   let rideRequest

//   if (EmergencyRide) {
//     console.log(EmergencyRide);
//     if (EmergencyRide.status === 'pending') {
//       rideRequest = EmergencyRide
//     }

//   } else {


//     rideRequest = await Ride.findOne({ status: "pending" });


//   }
//   newDetails = rideRequest
//   delete newDetails._id;

//   if (!rideRequest) {
//     return;
//   }


//   CurrentDrivers = await Driver.find({
//     status: "online",
//     vehicle: rideRequest.vehicle,
//     approval: "approved", _id: { $nin: newDetails.rejected }
//   }, { _id: 1 });


//   console.log(CurrentDrivers.length);

//   CurrentDriver = CurrentDrivers[0]


//   let driver = CurrentDriver

//   if (!driver) {
//     return
//   }



//   changedriverstatus(driver, "busy")

//   const response = await new Promise(async (resolve) => {
//     console.log(driver);
//     if (driver.acceptride == "yes") {
//       resolve("accepted");
//       // let  z =await Ride.findByIdAndUpdate(rideRequest._id, newDetails,{new:true})
//     } else {
//       console.log('next');
//       resolve("next");
//       changedriverstatus(driver, "online")


//       z = await Ride.updateOne(
//         { _id: rideRequest._id },
//         { $push: { rejected: driver } })
//     }
//   });
//   if (response === "accepted") {
//     console.log("accepted");
//     rideaccepted(driver, rideRequest)
//     return;

//   }

// };

// const job = new CronJob('* * * * * *', async () => {
//   let currentTime = new Date()


//   // const next10Seconds = new Date(Math.ceil(new Date().getTime() / 10000) * 10000);

//   // const rides = await Ride.aggregate([
//   //   {
//   //     $match: {
//   //       status: { $in: ['pending', 'assigning'] },
//   //       $expr: {

//   //         $gte: ['$createdAt', ServerStartTime]

//   //       }
//   //     }

//   //   },
//   //   {
//   //     $addFields: {
//   //       remainingSeconds: {
//   //         $mod: [

//   //           {
//   //             $divide: [
//   //               { $subtract: [new Date(), '$createdAt'] },
//   //               1000  // Divide by 1000 to convert milliseconds to seconds
//   //             ],
//   //           }, 30
//   //         ]

//   //       }
//   //     }
//   //   },

//   // ]);

//   let Rides = await Ride.find({ status: { $in: ['pending', 'assigning'] }, createdAt: { $lte: ServerStartTime.getTime() } })


//   // await inPerfectRide(rides, currentTime)

//   await cronefunc(Rides)


// });


// async function inPerfectRide(rides, currentTime) {

//   timeArray = []


//   for (let ride of rides) {
//     time = ride.remainingSeconds
//     timeArray.push({ time, ride })
//   }
//   timeArray.sort(function (a, b) { return a.time - b.time });


//   for (let Ride of timeArray) {
//     let ride = Ride
//     let time = currentTime.getTime() + (ride.time * 1000)


//     await waitForTime(currentTime, time)
//     console.log('here');

//     changedriverstatus({ _id: ride.driver }, "online")

//     let availableDriver = await Driver.findOne({
//       status: 'online', approval: 'approved',
//       _id: { $nin: ride.rejected },
//       vehicle: ride.vehicle


//     })

//     if (!availableDriver) {
//       ridedriver = {
//         driver: ''

//       }
//       console.log('no found');
//       continue
//     }
//     if (availableDriver) {
//       changedriverstatus(availableDriver, "busy")
//       ridedriver = {
//         driver: availableDriver._id
//       }
//       await Ride.updateOne(
//         { _id: ride._id },
//         { $push: { rejected: availableDriver._id } })
//       ride.driver = availableDriver.name

//     }

//     await Ride.findByIdAndUpdate(ride._id, ridedriver, { new: true })


//     gbsoket.on('driver_response', (res) => {
//       console.log('ayo ayo soket ma');

//     });




//   }








// }


// async function waitForTime(currentTime, desiredTime) {
//   let z = currentTime.getTime()
//   function getCurrentTime() {
//     const now = new Date();
//     return now.getTime()
//   }

//   await new Promise((resolve) => {
//     const checkTime = () => {
//       const currentTime = getCurrentTime();
//       if (currentTime === desiredTime) {
//         resolve(currentTime);
//       } else {
//         setImmediate(checkTime);
//       }
//     };

//     checkTime();
//   });



// }

// async function cronefunc(Rides) {

//   for (let ride of Rides) {
//     let ridedriver


//     if (ride.driver !== "No Driver" ){

      
//       await changedriverstatus({ _id: ride.driver }, "online")
//     }


//     let availableDriver = await Driver.findOne({
//       status: 'online', approval: 'approved',
//       _id: { $nin: ride.rejected },
//       vehicle: ride.vehicle
//     })


//     if (!availableDriver) {

//       console.log('no driver',availableDriver,ride._id);
//       ridedriver = {
//         driver: ''

//       }
//      let z =  await Ride.findByIdAndUpdate(ride._id,{rejected:[],driver:"No Driver"},{new:true})
//       console.log('no found');
//       console.log(z);
//       continue
//     }
//     if (availableDriver) {
//       changedriverstatus(availableDriver, "busy")
//       ridedriver = {
//         driver: availableDriver._id
//       }
//       await Ride.updateOne(
//         { _id: ride._id },
//         { $push: { rejected: availableDriver._id } })
//       ride.driver = availableDriver.name

//     }

//    let upride= await Ride.findByIdAndUpdate(ride._id, ridedriver, { new: true })

//     changeRideStatus(upride,availableDriver)


//     // await new Promise(resolve => {
//     //     gbsoket.on('driver_response', (res) => {
//     //       console.log('ayo ayo soket ma');
//     //       resolve()
//     //     })
//     //   });






//   }


// }






// var job = new CronJob("*/10 * * * * *", async function () {

//   const rideRequest = await Ride.findOne({ status: "pending" });
//   if (!rideRequest) {
//     return;
//   }


//   const drivers = await Driver.find({
//     status: "online",
//     vehicle: rideRequest.vehicle,
//     approval: "approved",
//   });

//   for (const driver of drivers) {
//     changedriverstatus(driver,"busy")

//     const response = await new Promise((resolve) => {
//       // const intervalId = setTimeout(() => {
//         if (driver.acceptride == "yes") {
//           rideaccepted(driver,rideRequest)
//           clearTimeout(intervalId);
//           resolve("accepted");
//         } else {
//           console.log(driver.name);
//           resolve("next");
//           changedriverstatus(driver,"online")


//         }
//       // }, 2000);
//     });

//     if (response === "accepted") {
//       console.log("accepted");
//       return;
//     }




//   }

// });

const cronService = require('./controllers/cronjob/crone')


cronService.getSettingData()
cronService.job.start();

server.listen(3000, () => {
  console.log("port is runiing...(at 3000)");
});


// const rides = await Ride.aggregate([
//   {
//     $match: {
//       status: { $in: ['assigning'] },
//       assignType: { $in: ['next', 'selected'] }


//     }

//   },
//   {
//     $addFields: {
//       remainingSeconds: {
//         // $ceil: {

//           $add: [
//             { 
//               $subtract: [new Date(), '$updatedAt']
//              },
//              currentTime.getTime()
//             // 1000  // Divide by 1000 to convert milliseconds to seconds
//           ],
//         // }

//       }
//     }
//   },
//   // {
//   //   $match: {
//   //     remainingSeconds: {
//   //       $lt:10
//   //     }
//   //   }
//   // },
//   {
//     $sort:{updatedAt:1}
//   }

// ]);