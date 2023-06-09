

const stripe = require('stripe')('sk_test_51N2piRJAU9zBfSBOhszeL5HWLkSKstapCQzk6dbn4ZUjR8xBLPYZPP64VvIUJEACl5COj23WPMpTMBjD400xVSzi00q0Ayujkw');
const Driver = require('../../model/driver');
const Ride = require('../../model/rides');

class driversController {

    static addNewDriver = async (req, res) => {

        if (req.file) {
            req.body.avatar = req.file.filename
        } else {
            req.body.avatar = "";
        }
    
        try {
        
            const customer = await stripe.customers.create({ email: req.body.email })
            req.body['stripeid'] = customer.id
    
            const bankAccount = await stripe.customers.createSource(customer.id, {
                source: {
                  object: 'bank_account',
                  country: 'US', 
                  currency: 'usd',
                  account_holder_name: 'John Doe', 
                  account_holder_type: 'individual',
                  routing_number: '110000000', 
                  account_number: '000999999991',
                },
              });
    
            const driver = new Driver(req.body);
    
            await driver.save();
            await res.json(driver)
            // } else {
            //     res.json({ errors })
            // }
    
        } catch (e) {
            console.log(e);
        }
    }

    static getAllAddedDrivrsandSearch = async (req, res) => {

        let regext;
        let data
    
    
        console.log('another here');
    
    
        const currentPage = req.query.page || 1;
        const limits = req.query.size || 3
    
    
        try {
    
            let pipeline = [
    
                {
                    $facet: {
                        documents: [
                            { $match: {} },
    
                            {
                                $lookup: {
                                    from: 'countries',
                                    localField: 'country',
                                    foreignField: '_id',
                                    as: 'country'
                                }
                            },
                            {
                                $unwind: '$country'
                            },
                            {
                                $lookup: {
                                    from: 'zones',
                                    localField: 'city',
                                    foreignField: '_id',
                                    as: 'city'
                                }
                            },
                            {
                                $unwind: '$city'
                            },
                            {
                                $lookup: {
                                    from: 'vehicles',
                                    localField: 'vehicle',
                                    foreignField: '_id',
                                    as: 'vehicle'
                                }
                            },
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
    
    
            if (req.query.str) {
                const str = req.query.str
                regext = new RegExp(str, "i")
                pipeline.unshift({
                    $match: {
                        $or: [
                            // {_id: new mongoose.Types.ObjectId(str)},
                            { name: regext },
                            { mobile: regext },
                            { email: regext },
                        ]
    
    
                    }
                })
    
            }
    
    
            data = await Driver.aggregate(pipeline)
    
    
            let totalCounts = data[0]?.count[0]?.total
    
    
            const pages = Math.ceil(totalCounts / limits)
    
    
    
    
            res.json({
                count: totalCounts,
                drivers: data[0].documents,
                pages
    
            })
        } catch (e) {
            console.log(e);
    
        }
    
    }

    static deleteDriver = async (req, res) => {
        try {
            let user = await Driver.findOneAndRemove({ '_id': req.params.id })
    
            res.send(user)
        } catch (e) {
            console.log(e);
    
        }
    }

    static getDriverFromId = async (req, res) => {
        try {
            let user = await Driver.findById(req.query.id)
    
            res.send(user)
        } catch (e) {
            console.log(e);
    
        }
    }

    static getApprovedDriver = async (req, res) => {



        try {
    
    
    
            const driver = await Driver.findByIdAndUpdate(req.query.id, req.body, { new: true, runValidators: true })
            const auth = require('../middleware/auth')
    
        } catch (e) {
            console.log(e);
    
        }
    
    }

    static getOnlineDriver = async (req, res) => {

        const currentPage = req.query.page || 1;
        const limits = req.query.size
        const str = req.query.str
        const regext = new RegExp(str, "i")
    
        try {
    
    
            const data = await Driver.find({ status: 1 })
    
    
            res.json(data)
    
        } catch (e) {
            console.log(e);
    
        }
    
    }

    static SaveUpdatedDetailofDriver =  async (req, res) => {
        if (req.file) {
            req.body.file = req.file.filename
        }
    
        try {
            const user = await Driver.findByIdAndUpdate(req.query.id, req.body, { new: true, runValidators: true })
            res.json(user)
            console.log(user);
    
        } catch (e) {
            errors = {
    
            }
    
            if (e.keyPattern?.email && e.keyValue?.email) {
    
    
                errors.email = "email already exist"
            } else if (e.keyPattern?.mobile && e.keyValue) {
                errors.number = "number already exist"
    
            }
            res.status(400).send(errors)
            console.log(e);
    
        }
    
    }

    static getRunningRequest = async (req, res) => {


        try {
            const rides = await Ride.aggregate([
                {
                    $match: {
                        status: {
                            $in: [1]
    
                        }
                    }
                },
    
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
                        from: 'drivers', 
                        localField: 'driver',
                        foreignField: '_id',
                        as: 'driver'
                    }
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
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        remainingSeconds: {
                            $ceil: {
    
                                $divide: [
                                    { $subtract: [new Date(), '$updatedAt'] },
                                    1000 
                                ],
                            }
    
                        }
                    }
    
                }
            ])
    
    
    
    
            res.json(rides)
        } catch (e) {
            console.log(e);
    
        }
    
    }

}

module.exports = driversController;
