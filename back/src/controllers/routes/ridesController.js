const { default: mongoose } = require("mongoose");
const Rides = require("../../model/rides");

class ridesController {
    static addNewRide = async (req, res) => {

        try {
            const Ride = new Rides(req.body);

            await Ride.save();
            await res.json(Ride)


        } catch (e) {
            console.log(e);
        }


    }

    static getCompletedRides = async (req, res) => {

        let regext;
        let sortCriteria




        const currentPage = req.query.page || 1;
        const limits = req.query.size || 3

        if ((req.query.field && req.query.order) !== 'undefined') {
            const field = req.query.field;
            const order = req.query.order;
            sortCriteria = {};
            sortCriteria[field] = order;


        } else {
            sortCriteria = { name: -1 };
        }



        try {

            let pipeline = [
                {
                    $lookup: {
                        from: 'vehicles',
                        localField: 'vehicle',
                        foreignField: '_id',
                        as: 'vehicle'
                    }
                },
                {
                    $unwind: '$vehicle'
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $match: {
                        status: {
                            $in: [6, 7]

                        }
                    }
                },
                {
                    $facet: {
                        documents: [

                            {
                                $skip: (currentPage - 1) * limits,
                            },
                            {
                                $limit: limits,
                            },

                        ],
                        count: [
                            { $count: "total" }
                        ]
                    }
                },


            ]



            // if (req.query.str) {
            //     const str = req.query.str
            //     regext = new RegExp(str, "i")
            //     pipeline.splice(5, 0, {
            //         $match: {
            //             $or: [
            //                 { _id: regext },
            //                 { "vehicle.name": regext },
            //                 { "user.name": regext },
            //                 // { "vehicle.name": regext },
            //             ]


            //         }
            //     })

            // }
            if (req.query.search_type) {
                console.log('wokk');
                const str = req.query.search_value
                regext = new RegExp(str, "i")
                let options = {}
                if (req.query.search_type == '_id') {

                    options['_id'] = new mongoose.Types.ObjectId(str)
                } else {
                    options[req.query.search_type] = regext
                    options['status'] = +req.query.status


                    options['payment_type'] = req.query.payment_mode

                    if (req.query.from_date) {

                        options['createdAt'] = {

                            $gte: new Date(req.query.from_date),
                            $lte: new Date(req.query.to_date)
                        }
                    }
                }

                console.log(options, 'options');

                pipeline.splice(5, 0, {
                    $match:

                        options



                })

                console.log(pipeline[5]);

            }

            // const data = await Rides.find({ status: { $in: [6, 7] } })
            const data = await Rides.aggregate(pipeline).sort(sortCriteria)

            // res.json(data)

            let totalCounts = data[0]?.count[0]?.total


            const pages = Math.ceil(totalCounts / limits)



            res.json({
                count: totalCounts,
                rides: data[0].documents,
                pages

            })

        } catch (e) {
            console.log(e);

        }

    }

    static getConfirmedRides = async (req, res) => {
        console.log('try to get confirmed rides');
        console.log(req.query);
        // console.log(req.params);
        try {

            let regext;
            let sortCriteria

            console.log(req.query.page);

            const currentPage = req.query.page || 1;
            const limits = req.query.size || 3

            if ((req.query.field && req.query.order) !== 'undefined') {
                const field = req.query.field;
                const order = req.query.order;
                sortCriteria = {};
                sortCriteria[field] = order;


            } else {
                sortCriteria = { name: -1 };
            }



            let pipeline = [

                {
                    $lookup: {
                        from: 'vehicles',
                        localField: 'vehicle',
                        foreignField: '_id',
                        as: 'vehicle'
                    }
                },
                {
                    $unwind: '$vehicle'
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $match: {
                        status: {
                            $nin: [1, 6, 7]

                        }
                    }
                },
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
                            { $count: "total" } // Count the documents
                        ]
                    }
                },


            ]

            if (req.query.search_type) {
                console.log('wokk');
                const str = req.query.search_value
                regext = new RegExp(str, "i")
                let options = {}
                if (req.query.search_type == '_id') {

                    options['_id'] = new mongoose.Types.ObjectId(str)
                } else {
                    options[req.query.search_type] = regext
                    options['status'] = +req.query.status
                    options['payment_type'] = req.query.payment_mode
                    if (req.query.from_date) {

                        options['createdAt'] = {

                            $gte: new Date(req.query.from_date),
                            $lte: new Date(req.query.to_date)
                        }
                    }
                }

                console.log(options, 'options');

                pipeline.splice(5, 0, {
                    $match:
                        // $or: [
                        // {_id: new mongoose.Types.ObjectId(str)},
                        // {'_id':regext},
                        // options[0],
                        // options[1]
                        options

                    // { "vehicle.name": regext },
                    // { "user.name" : regext }, 
                    // { "user.mobile" : regext }, 
                    // ]



                })



            }

            const data = await Rides.aggregate(pipeline).sort(sortCriteria)
            // res.json(data)

            let totalCounts = data[0]?.count[0]?.total


            const pages = Math.ceil(totalCounts / limits)
            // console.log(pages, data[0].documents.length, limits, pages, data[0]?.count[0].total);



            res.json({
                count: totalCounts,
                rides: data[0].documents,
                pages

            })

        } catch (e) {
            console.log(e);
            res.status(400).send(e)

        }

    }

}

module.exports = ridesController;
