const { default: mongoose } = require("mongoose");
const Rides = require("../../model/rides");

class ridesController {
  static addNewRide = async (req, res) => {
    try {
      const Ride = new Rides(req.body);

      await Ride.save();
      await res.status(200).send({ Ride, msg: "Ride Added Successfully" });
    } catch (e) {
      res.status(400).send({ msg: 'Something Went Wrong' });

      console.log(e);
    }
  };

  static getCompletedRides = async (req, res) => {
    let regext;
    let sortCriteria;

    const currentPage = req.query.page || 1;
    const limits =  10;

    if ((req.query.field && req.query.order) !== "undefined") {
      const field = req.query.field;
      const order = req.query.order;
      sortCriteria = {};
      sortCriteria[field] = order;
    } else {
      sortCriteria = { name: -1 };
    }

    try {

      let pipeline1 =[  {
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
        $match: {
          status: {
            $in: [6, 7],
          },
        },
      },
]
      let pipeline2 =[ {
        $facet: {
          documents: [
            {
              $skip: (currentPage - 1) * limits,
            },
            {
              $limit: limits,
            },
          ],
          count: [{ $count: "total" }],
        },
      },]
   
      let  pipeline3 = []

      if (req.query.search_type) {

        const str = req.query.search_value;
        regext = new RegExp(str, "i");
        let options = {};

        if (
          req.query.search_type == "_id" &&
          mongoose.Types.ObjectId.isValid(str)
        ) {
          options["_id"] = new mongoose.Types.ObjectId(str);
        }
        if (req.query.search_value && req.query.search_type !== "_id") {
          options[req.query.search_type] = regext;
        }
        if (req.query.from_date) {
          options["createdAt"] = {
            $gte: new Date(req.query.from_date),
            $lte: new Date(req.query.to_date),
          };
        }if(req.query.status){
          
          options["status"] = +req.query.status ;
        } 

          options["payment_type"] = +req.query.payment_mode;
        


        pipeline3.push({
          $match: options,
        });

      }
       if (req.query.download) {
        console.log("FOr Download");
        const data = await Rides.aggregate([...pipeline3])
        if(data.length === 0){
          res.status(400).send({ msg: "Confirmed Rides's List Not Found" })
        }else{

          
          res.status(200).send({ msg: "Ride's Data Found", rides: data })
        }
        return

      }

      const data = await Rides.aggregate([...pipeline1,...pipeline3,...pipeline2]).sort(sortCriteria);


      if (data[0]?.count.length === 0) {
        res.status(400).send({ msg: "Completed Rides's List Not Found" })
        return
      }
      let totalCounts = data[0]?.count[0]?.total;

      const pages = Math.ceil(totalCounts / limits);

      res.status(200).send({
        count: totalCounts,
        rides: data[0].documents,
        pages,
        msg: "Completed Rides's List  Found"
      });
    } catch (e) {
      res.status(400).send({ msg: 'Something Went Wrong' });

      console.log(e);
    }
  };

  static getConfirmedRides = async (req, res) => {
    // console.log('try to get confirmed rides');
    // console.log(req.params);
    try {
      let regext;
      let sortCriteria;

      // console.log(req.query.page);

      const currentPage = req.query.page || 1;
      const limits =  10;

      if ((req.query.field && req.query.order) !== "undefined") {
        const field = req.query.field;
        const order = req.query.order;
        sortCriteria = {};
        sortCriteria[field] = order;
      } else {
        sortCriteria = { createdAt: -1 };
      }

      let pipeline1 = [
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
        }, {
          $match: {
            status: {
              $nin: [1, 6, 7],
            },
          },
        },
      ]

      let pipeline2 = [

        {
          $facet: {
            documents: [
              {
                $skip: (currentPage - 1) * limits, // Skip documents based on the current page
              },
              {
                $limit: limits, // Limit the number of documents per page
              },
              
              // Retrieve the whole document
            ],
            count: [
              { $count: "total" }, // Count the documents
            ],
          },
        },
      ];

   let  pipeline3 = []

      if (req.query.search_type) {
        const str = req.query.search_value;
        regext = new RegExp(str, "i");
        let options = {};

        if (
          req.query.search_type == "_id" &&
          mongoose.Types.ObjectId.isValid(str)
        ) {
          options["_id"] = new mongoose.Types.ObjectId(str);
        }
        if (req.query.search_value && req.query.search_type !== "_id") {
          options[req.query.search_type] = regext;
        }
        if (req.query.from_date) {
          options["createdAt"] = {
            $gte: new Date(req.query.from_date),
            $lte: new Date(req.query.to_date),
          };
        } if(req.query.status){
          
          options["status"] = +req.query.status ;
        } 
        options["payment_type"] = +req.query.payment_mode;

        pipeline3.push({
          $match: options,
        });
      }
      if (req.query.download) {
        const data = await Rides.aggregate([...pipeline3])
        if(data.length === 0){
          res.status(400).send({ msg: "Confirmed Rides's List Not Found" })
        }else{

          
          res.status(200).send({ msg: "Ride's Data Found", rides: data })
        }
        return

      }

      const data = await Rides.aggregate([...pipeline1,...pipeline3 ,...pipeline2]).sort(sortCriteria);


      if (data[0]?.count.length === 0) {
        res.status(400).send({ msg: "Confirmed Rides's List Not Found" })
        return
      }
      let totalCounts = data[0]?.count[0]?.total;

      const pages = Math.ceil(totalCounts / limits);
      // console.log(pages, data[0].documents.length, limits, pages, data[0]?.count[0].total);

      res.json({
        count: totalCounts,
        rides: data[0].documents,
        pages,
        msg: "Completed Rides's List  Found"

      });
    } catch (e) {
      console.log(e);
      res.status(400).send({ msg: 'Something Went Wrong' });
    }
  };
}

module.exports = ridesController;
