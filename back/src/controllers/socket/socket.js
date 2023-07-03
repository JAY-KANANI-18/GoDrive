//socket.js
const Driver = require("../../model/driver");
const Ride = require("../../model/rides");
const socketIO = require("socket.io");

let io; // Declare the io variable

function initialize(server) {
  io = socketIO(server);

  io.on("connection", (socket) => {
    const cron = require("../cronjob/crone");

    console.log("A client has connected");
    socket.on("request_select_assign", async (ride, driver) => {
      const ndriver = await Driver.findByIdAndUpdate(
        driver._id,
        { sta },
        {
          new: true,
          runValidators: true,
        }
      );
      io.emit("driver_status_change", { driver: ndriver });

      const nride = await Ride.findByIdAndUpdate(ride._id, change, {
        new: true,
        runValidators: true,
        multi: true,
      });
      io.emit("ride_status_change", nride);
      // io.emit("toDriver", data);
    });

    socket.on("ride_status_change", async (data) => {
      try{

        let obj = {
          status: data.ride.status,
        };
        
        if (data.ride.assignType) {
          obj["assignType"] = data.ride.assignType;
        }
        if (data.ride.driver) {
          obj["driver"] = data.ride.driver;
        }
        
        const rides = await Ride.findByIdAndUpdate(data.ride.id, obj, {
          new: true,
        });
        
        io.emit("ride_status_change", { rides, driver: data.driver });
      }catch(e){
        console.log(e);

      }
      });

    socket.on("driver_status_change", async (driver) => {

      try{

        let data = {
          status: driver.status,
        };
        
        let ndriver = await Driver.findByIdAndUpdate(driver.id, data, {
          new: true,
          runValidators: true,
        });
        // io.emit("driver_status_change", ndriver);
      }catch(e){
        console.log(e);

      }
      });
    socket.on("ride_auto_assign", async (ride) => {
      const rides = await Ride.findByIdAndUpdate(
        ride._id,
        { assignType: 0, status: 1 },
        { new: true }
      );

      // const ride = await Ride.findById(detail.id);
      console.log("auto new");

      // await cron.changedriverstatus(ride.driver,1)
      // const availabldriver = await cron.findDriver(rides)
      cron.assignDriver(rides);
      // cron.job.fireOnTick()
    });

    socket.on("accept_ride", async (detail) => {
      let id = "6448b5b2541475ce64a83e7f";
      let dataa = {
        currentride: detail,
      };

      const driver = await Driver.findOneAndUpdate(id, dataa, {
        new: true,
        runValidators: true,
      });
    });

    socket.on("driver_response", async (detail) => {
      if (detail.res == "reject") {
        console.log("rejected");
        const ride = await Ride.findById(detail.id);

        if (ride.driver) {
          await cron.changedriverstatus(ride.driver, 1);
        }
        const availabldriver = await cron.findDriver(ride);
        // if(availabldriver){
        cron.assignDriver(ride);
        // }

        io.emit("driver_response", ride);

        // cron.job.fireOnTick()
      }
    });
    socket.on("disconnect", () => {
      console.log("A client has disconnected");
    });
  });
}

function getIO() {
  return io;
}

module.exports = {
  initialize,
  getIO,
};
