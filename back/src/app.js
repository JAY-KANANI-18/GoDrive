// server side


const mongoose = require("mongoose")
const express = require("express");
const path = require('path')
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const adminRouter = require("../src/router/admin")
const pricingRouter = require("../src/router/pricing")
const ridesRouter = require("../src/router/rides")
const usersRouter = require("../src/router/users")
const driversRouter = require("../src/router/drivers")
const Driver = require('./model/driver')
const Ride = require('./model/rides')
const cron = require('cron');
var CronJob = require('cron').CronJob;



const loginRouter = require("../src/router/login")
const http = require('http');



const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
// const io = socketio(server)

app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set('strictQuery', true)
mongoose.connect("mongodb://127.0.0.1:27017/GoDrive")






const publicDiractoryPath = path.join(__dirname, '../public')
// const viewPath = path.join(__dirname, "../src/templates/views")
app.use(express.static(publicDiractoryPath))



// app.set('view engine', 'hbs')
// app.set('views', viewPath)

app.use(adminRouter)
app.use(loginRouter)
app.use(ridesRouter)
app.use(usersRouter)
app.use(driversRouter)
app.use(pricingRouter)

// app.use(express.static(publicDiractoryPath))
// app.use(userRouter)


// app.use(cookieParser());







// **************************  MASS  INSERT USER MANUAL    **************************
// async function adduser (){
//     for (let i = 1; i <= 50; i++) {

//         const user = new User({
//             name:`user`,
//             mobile:10000000000-i,
//             country:`india`,
//             email:`user${i}@gmail.com`
//         }
//         )
//         await user.save()
//     }

// }
//     for(i=0;i<50 ;i++){

//         const user = new User({
//             name:`user${i}`,
//             mobile:10000000000-i,
//             country:`india${i}`,
//             email:`user${i}@gmail.com`

//         })


// adduser()
// }
// ***************************** End ***************************





io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });
  socket.on('request-select-assign', (data) => {
    io.emit('toDriver', data);
  });
  // socket.on('driver-location', (location) => {
  //   driverLocation = location;
  //   io.emit('driver-location', driverLocation);
  // });
  socket.on('status_change', async (location) => {

    let data = {
      status: location.status
    }

    const driver = await Ride.findOneAndUpdate(location.id, data, { new: true, runValidators: true })



    io.emit('status_change', location);
  });
  socket.on('driver_status_change', async (location) => {

    let data = {
      status: location.status
    }

    const driver = await Driver.findOneAndUpdate(location.id, data, { new: true, runValidators: true })



    io.emit('status_change', location);
  });
  socket.on('accept_ride', async (detail) => {
    let id = "6448b5b2541475ce64a83e7f"
    let dataa = {
      currentride: detail
    }

    const driver = await Driver.findOneAndUpdate(id, dataa, { new: true, runValidators: true })


  });
  // socket.on('search_driver', (data) => {






  //   cron.schedule('* * * * *', async () => {
  //     const rideRequests = await Ride.find({ status: 'pending' });

  //     for (const rideRequest of rideRequests) {
  //       const timeDifference = Date.now() - rideRequest.createdAt.getTime();

  //       if (timeDifference > TIMEOUT_DURATION) {
  //         // Mark the ride request as unassigned and update its status in the database to "timed out"
  //         // ...
  //       }
  //     }
  //   });



  //   app.post('/search-for-driver', async (req, res) => {
  //     const rideRequest = req.body;

  //     const { driver } = await searchForDriver(rideRequest);

  //     res.json({ driver });
  //   });








  //   const searchForDriver = async (rideRequest) => {
  //     // Search for the nearest available driver(s) in the database
  //     // ...

  //     if (driver) {
  //       // Assign the ride request to the driver and update the ride request status in the database to "assigned"
  //       // ...
  //       return { driver };
  //     } else {
  //       // Mark the ride request as unassigned and update its status in the database to "no driver found"
  //       // ...
  //       return { driver: null };
  //     }
  //   };



  // })
  
  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});




var job = new CronJob('* * * * * *',async function() {  
  
  
  
  const rideRequest = await Ride.findOne({ status:'pending'});
    if (!rideRequest) {
      // Ride request does not exist
      return;
    }

    // if (rideRequest.status === 'assigned') {
    //   // Ride request has already been assigned to a driver
    //   return;
    // }

    // if (rideRequest.status === 'timed_out') {
    //   // Ride request has already timed out
    //   return;
    // }

    const drivers = await Driver.find({ status: 'online' })

    for (const driver of drivers) {
      // Send a request to the driver
      io.emit('ride_request',  rideRequest);

      // Wait for the driver to accept or reject the request
      const response = await waitForDriverResponse( rideRequest);

      if (response === 'accepted') {
        // Driver has accepted the ride request
        // await assignRideRequestToDriver(driver, rideRequest);
        return;
      }
    }

    // No driver has accepted the ride request
    // await markRideRequestAsUnassigned(rideRequest);
    // socket.emit('no_driver_found', { rideRequestId: rideRequest._id });
  });

  // Stop the cron job if the user cancels the ride request



// job.start()


const waitForDriverResponse = async (rideRequest) => {
    let timer;

    let res 

    io.on('check_driver',(data)=>{

     res =  data.response 
     
    })
    setTimeout(() => {
      if(!res){
        console.log('set time out on');
        res = "next"
      }
     
    }, 9000);
    

    return res








    const onDriverResponse = (data) => {
      if (data.driverId === driverId && data.rideRequestId === rideRequestId) {
        clearTimeout(timer);
        socket.off('ride_request_response', onDriverResponse);
        resolve(data.response);
      }
    };

    timer = setTimeout(() => {
      socket.off('ride_request_response', onDriverResponse);
      resolve('timeout');
    }, timeout);

    socket.on('ride_request_response', onDriverResponse);
};




server.listen(3000, () => {
  console.log('port is runiing...(at 3000)')
})

