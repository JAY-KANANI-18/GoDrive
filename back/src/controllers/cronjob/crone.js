var CronJob = require("cron").CronJob;
const Driver = require("../../model/driver");
const Ride = require("../../model/rides");
const Settings = require("../../model/settings");
const Sockets = require('../socket/socket')

const io = Sockets.getIO();

let RideacceptenceTime
async function getSettingData() {
  data = await Settings.findOne()

  RideacceptenceTime = data.AcceptenceTimeForRide

}

job = new CronJob('*/10 * * * * *', async () => {
  console.log('job start');
  let currentTime = new Date()
  const rides = await Ride.aggregate([
    {
      $match: {
        status: { $in: [1] },
        assignType: { $in: [1, 2] }
      }
    },
    {
      $addFields: {
        remainingSeconds: {
          $add: [
            {
              $subtract: [RideacceptenceTime*1000, {
                $subtract: [currentTime, '$updatedAt']
              }]
            },
            currentTime
          ],
        }
      }
    },

    {
      $sort: { updatedAt: 1 }
    }

  ]);
  const newRides = await Ride.find({ status: 1, assignType: 0 });
  const rejectedRides = await Ride.find({ status: 1, assignType: 3 });

  if (rejectedRides.length >= 1) {
    await inPerfectRide(rejectedRides)
    return
  }
  if (newRides.length >= 1) {
    await inPerfectRide(newRides)
    return

  } else {
    await inPerfectRide(rides, 1)

  }
});

async function waitForTime(desiredTime) {

  function getCurrentTime() {
    const now = new Date();
    return now.getTime()
  }

  await new Promise((resolve) => {
    const checkTime = () => {
      const currentTime = getCurrentTime();
      if (currentTime >= desiredTime) {
        resolve(currentTime);
      } else {
        setImmediate(checkTime);
      }
    };

    checkTime();
  });
}

async function inPerfectRide(rides, type) {
  for (let ride of rides) {

    if (type === 1 && ride.remainingSeconds) {
      await waitForTime(ride.remainingSeconds.getTime())
    }
    if (ride.assignType === 2) {
      changedriverstatus({ _id: ride.driver }, 1)
      changeRideStatus(ride, { $set: { rejected: [], status: 0 }, assignType: 4, $unset: { driver: 1 } })
      continue
    }

    await changeRideStatus(ride, { status:1})

    if (ride.driver) {
      console.log('driver freeee');
      await changedriverstatus({ _id: ride.driver }, 1)
    }

    let freeDriver = await Driver.findOne({
      status: 1, approval: 1,
      _id: { $nin: ride.rejected },
      vehicle: ride.vehicle
    })

    if (!freeDriver) {
      console.log('no found');

      if (ride.assignType == 2) {///here
        changeRideStatus(ride, { $set: { rejected: [], status: 0 }, assignType: 4, $unset: { driver: 1 } })
        return
      }

      let busyDriver = await Driver.find({
        status: 2, approval: 1,
        _id: { $not: { $in: ride.rejected } },
        vehicle: ride.vehicle
      })

      if (busyDriver.length >= 1) {
        
        changedriverstatus({ _id: ride.driver }, 1)
        console.log(ride.driver);

        changeRideStatus(ride, { $unset: { driver: 1 } })

      } else {
        changeRideStatus(ride, { $set: { rejected: [], status: 0 }, assignType: 4, $unset: { driver: 1 } })
        z = await Ride.find({ assignType: 4 }).count()
        io.emit('notification', { msg: z })

      }
      changedriverstatus({ _id: ride.driver }, 1)
      // io.emit('notification', { msg: 'driver free'})

      continue
    }
    assignDriver(ride, freeDriver)
    if (ride.assignType == 0) {
      await changeRideStatus(ride, { assignType:1 })
    }
  }

}

async function changedriverstatus(driver, status) {
  let driverobj = {
    status
  }
  const ndriver = await Driver.findByIdAndUpdate(driver._id, driverobj, {
    new: true,
    runValidators: true,
  });
  io.emit('driver_status_change', { driver: ndriver })
}

async function changeRideStatus(ride, change, unset = '') {
  try {
    const nride = await Ride.findByIdAndUpdate(ride._id, change,
      {
        new: true,
        runValidators: true,
        multi: true
      });
    io.emit('ride_status_change', nride)
  } catch (e) {
    console.log(e);
  }


}

async function assignDriver(ride, driver) {
  changedriverstatus(driver, 2)
  ride.driver = driver._id
  ride.rejected.push(driver._id)
  await changeRideStatus(ride, { driver: driver._id, rejected: ride.rejected })
}


module.exports = {
  job,
  getSettingData,
  assignDriver
}
