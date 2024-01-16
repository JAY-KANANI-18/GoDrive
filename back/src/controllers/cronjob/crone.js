var CronJob = require("cron").CronJob;
const { default: mongoose } = require("mongoose");
const Driver = require("../../model/driver");
const Ride = require("../../model/rides");
const Settings = require("../../model/settings");
const Sockets = require("../socket/socket");

const io = Sockets.getIO();

let RideacceptenceTime;

async function getSettingData() {
  data = await Settings.findOne();

  RideacceptenceTime = data.AcceptenceTimeForRide;
  return data
}

job = new CronJob(`*/30 * * * * *`, async () => {
  let currentTime = new Date();

  //---> Found Rides With Assigning Status
  const rides = await Ride.aggregate([
    {
      $match: {
        status: { $in: [1] },
      },
    },
    // {
    // $addFields: {
    //   remainingSeconds: {
    //     $add: [
    //       {
    //         $subtract: [
    //           RideacceptenceTime * 1000,
    //           {
    //             $subtract: [currentTime, "$updatedAt"],
    //           },
    //         ],
    //       },
    //       currentTime,
    //     ],
    //   },
    // },
    // },
    {
      $sort: { updatedAt: 1 },
    },
  ]);

  await handleTimeOut(rides);
});

//---> Wait For Time TO Match Our Time
async function waitForTime(ride) {
  let resolved = false;

  function getCurrentTime() {
    const now = new Date();
    return now.getTime();
  }

  return z = await new Promise((resolve) => {
    const checkTime = async () => {
      const currentTime = getCurrentTime();

      let cride
      if (
        currentTime == ride.updatedAt.getTime() + RideacceptenceTime * 1000 &&
        !resolved
      ) {

        resolved = true;
        console.log("taru");
        ride = await Ride.findById(ride._id)

        if (ride.status != 1) {
          return
        }
        console.log(cride);
        if (cride == ride) return
        await changeRideStatus(ride, { status: 1 });
        await assignDriver(ride);
        cride = ride
        // resolve();
      } else {
        setImmediate(checkTime);
      }
    };

    checkTime();
  });
}

//----> Check For Time-out  
async function handleTimeOut(rides, type) {


  for await (let ride of rides) {
    try {
      ride = await Ride.findById(ride._id)

      if (ride.status != 1) {
        continue
      }

      if (new Date().getTime() > ride.updatedAt.getTime() + RideacceptenceTime * 1000) // already greater than time timeout
      {
        await changeRideStatus(ride, { status: 1 });
        await assignDriver(ride);
        continue;
      }

      let test = 1;

      // hold untill time to match our timeout time
      await waitForTime(ride);
      test++;
      if (test == 2) {


        ride = await Ride.findById(ride._id)

        if (ride.status != 1) {
          continue
        }

        await changeRideStatus(ride, { status: 1 });
        await assignDriver(ride);
        continue
      } else {
        continue
      }
    } catch (e) {
      console.log(e);
    }
  }
}

//----> Change driver's Details
async function changedriverstatus(driver, status, change = null) {
  let driverobj = {
    status,
  };
  if (change) {

    driverobj = {
      status,
      ...change
    }

  }
  const ndriver = await Driver.findByIdAndUpdate(driver._id, driverobj, {
    new: true,
    runValidators: true,
  });


  io.emit("driver_status_change", { driver: ndriver });
}


//----> Change Ride's Details
async function changeRideStatus(ride, change, unset = "") {
  console.log("satus change");
  try {
    let nride = await Ride.findByIdAndUpdate(ride._id, change, {
      new: true,
      runValidators: true,
      multi: true,



    });

    let pipeline1 = [{
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
    {
      $lookup: {
        from: "drivers",
        localField: "driver",
        foreignField: "_id",
        as: "driver",
      },
    },
      // {
      //   $unwind: "$driver",
      // },


    ]
    nride = await Ride.aggregate([{
      $match: {
        _id: nride._id
      }

    }, ...pipeline1])

    io.emit("ride_status_change", nride[0]);
  } catch (e) {
    console.log(e);
  }
}


//----> Assign a New Driver
async function assignDriver(ride) {

  console.log('abcd');

  //----> Free the previous driver
  ride = await Ride.findById(ride._id)


  if (ride.driver) {
    await changedriverstatus({ _id: ride.driver }, 1, { currentride: null });
    await changeRideStatus(ride, {
      $set: { driver: null },
      assignType: 1,
    });
  }


  //----> If assign type is selected driver then  free the driver and change ride status to reassign
  if (ride.assignType === 2) {
    await changedriverstatus({ _id: ride.driver }, 1);
    await changeRideStatus(ride, {
      $set: { rejected: [], status: 0 },
      assignType: 4,
      $unset: { driver: 1 },
    });
    return;
  }

  //----> Find currently Available Driver
  const availableDriver = await findDriver(ride);

  //----> Not Found Any currently Available Driver
  if (!availableDriver) {


    //----> Get Driver which is currently on hold 
    const remainingDriver = await findRemainingDriver(ride);

    if (remainingDriver) {

      //---> If Remaining Drivers Found Than Ride Continue with status Assigning
      await changeRideStatus(ride, {
        $set: { driver: null },
        assignType: 1,
      });
    } else {
      //----> If Remaining Drivers Not Found Than Ride Status Chnage Into Re-assign
      await changeRideStatus(ride, {
        $set: { rejected: [], status: 0 },
        assignType: 4,
        $unset: { driver: 1 },
      });

      //----> Send Notification with count
      z = await Ride.aggregate([{
        $match: {
          status: 0,
          assignType: 4
        }
      }])
      await io.emit("notification", { msg: z.length });
    }
    // changedriverstatus({ _id: ride.driver }, 1);
    return;
  }

  ride = await Ride.findById(ride._id)



  //----> If Driver is Available , then Change Driver status 'hold'



  //----> Add Driver to rejection list
  ride.rejected.push(availableDriver._id);
  await changeRideStatus(ride, {
    $set: { driver: availableDriver._id, rejected: ride.rejected },
  });

  if (ride.driver != null || undefined) return
  await changedriverstatus(availableDriver, 2);

  //---> If assign type is "assign" change into "next"
  // if (ride.assignType == 0) {
  //   await changeRideStatus(ride, { assignType: 1 });
  // }
}

//----> Find a Driver For Ride
async function findDriver(ride) {
  let availableDriver = await Driver.findOne({
    status: 1,
    approval: 1,
    _id: { $nin: ride?.rejected },
    vehicle: ride.vehicle,
    currentride: null
  });

  return availableDriver;
}

//----> Find Driver which is hold for Ride
async function findRemainingDriver(ride) {
  let remainingDrivers = await Driver.findOne({
    status: 2,
    approval: 1,
    _id: { $not: { $in: ride.rejected } },
    vehicle: ride.vehicle,
  });

  return remainingDrivers;
}

module.exports = {
  job,
  getSettingData,
  assignDriver,
  findDriver,
  changedriverstatus,
  changeRideStatus,
};
