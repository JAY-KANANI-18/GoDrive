const User = require("../../model/user");

const stripe = require('stripe')('sk_test_51N2piRJAU9zBfSBOhszeL5HWLkSKstapCQzk6dbn4ZUjR8xBLPYZPP64VvIUJEACl5COj23WPMpTMBjD400xVSzi00q0Ayujkw');


class usersController {

    static addUser =  async (req, res) => {

        if (req.file) {
            req.body.avatar = req.file.filename
        } else {
            req.body.avatar = "";
        }
    
        try {
            const customer = await stripe.customers.create({ email: req.body.email })
            req.body['stripeid'] = customer.id
    
            const user = new User(req.body);
    
    
            sendMail.sendMail(user.email, "Welcome", "welcome to Godrive")
            sendSMS.sendSMS('+917043714531', "welcome to Godrive")
    
            await user.save();
            await res.json({ user, customer })
    
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

    static getUsers = async (req, res) => {


        let regext;
        let data
        let sortCriteria




        const currentPage = req.query.page || 1;
        const limits = req.query.size || 3


        console.log('currentPage', req.query);



        if ((req.query.field && req.query.order) !== 'undefined') {

            console.log('ayyyy');
            const field = req.query.field;
            const order = req.query.order;
            sortCriteria = {};
            sortCriteria[field] = +order;

            console.log(sortCriteria);


        } else {
            sortCriteria = { name: -1 };
        }





        try {





            let pipeline = [

                {
                    $facet: {
                        documents: [
                            { $match: {} },
                            {
                                $lookup: {
                                    from: 'countries', // Name of the SUV collection
                                    localField: 'country',
                                    foreignField: '_id',
                                    as: 'country'
                                }
                            },
                            {
                                $unwind: '$country'
                            },
                            {
                                $skip: (currentPage - 1) * limits, // Skip documents based on the current page
                            },
                            {
                                $limit: limits, // Limit the number of documents per page
                            },
                            {
                                $sort:sortCriteria
                            }
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


            data = await User.aggregate(pipeline)
            // .sort(sortCriteria)




            let totalCounts = data[0]?.count[0]?.total


            const pages = Math.ceil(totalCounts / limits)



            res.json({
                count: totalCounts,
                users: data[0].documents,
                pages

            })

        } catch (e) {
            console.log(e);

        }

    }

    static deleteUser = async (req, res) => {
        try {
            let user = await User.findOneAndRemove({ '_id': req.params.id })

            res.status(200).send(user)
        } catch (e) {
            res.status(404).send(e)
        }
    }

    static getAddedUser = async (req, res) => {
        try {

            let user = await User.findOne({ mobile: req.body.number })
            if (!user) {
                res.send(user)

                return
            }
            res.send(user)
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

    static saveUpdatedUser = async (req, res) => {
        if (req.file) {
            req.body.file = req.file.filename
        }

        try {
            const user = await User.findByIdAndUpdate(req.query.id, req.body, { new: true, runValidators: true })
            res.json(user)

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

    static getDetailForUpdate = async (req, res) => {
        try {
            const user = await User.findById(req.query.id)

            const customer = await getCustomer(user.stripeid)
            console.log(customer);

            await res.status(200).json({ user, customer })


        } catch (e) {
            res.status(404).send(e)
        }
    }

    static addUserCard = async (req, res) => {
        console.log('addUserCard');
        try {
            const user = await User.findById(req.query.id)
    
    
            await stripe.paymentMethods.attach(req.body.id, { customer: user.stripeid });
            // await stripe.customers.update(user.stripeid, { invoice_settings: { default_payment_method: req.body.id } });
    
            res.status(200).json({ msg: 'sucessfully added' });
    
    
    
        } catch (e) {
            res.status(404).send(e)
        }
    }

    static getPaymentFromUser =  async (req, res) => {
        const user = await User.findById(req.query.userid)
    
    
        try {
            let paymentIntent = await stripe.paymentIntents.create({
                amount: req.query.amount,
                currency: 'usd',
                payment_method_types: ['card'],
                payment_method: req.query.card, // replace with your payment method ID
                customer: user.stripeid, // replace with your customer ID
                confirm: true,
            });
            try {
                const transfer = await stripe.transfers.create({
                    amount: req.query.amount, // Amount in cents/pennies
                    currency: 'usd',
                    destination: 'ba_1NGFWlJAU9zBfSBORKOpMDdJ',
                });
                console.log('Transfer ID:', transfer.id);
                console.log('Transfer status:', transfer.status);
            } catch (error) {
                console.error('Transfer error:', error);
            }
    
    
    
    
    
            //   const transfer = await stripe.transfers.create({
            //     amount: req.query.amount, // Amount in cents/pennies
            //     currency: 'usd',
            //     destination: 'ba_1NGFWlJAU9zBfSBORKOpMDdJ',
            //   });::::here destination is my custimers account id but;;;;;Transfer error: StripeInvalidRequestError: No such destination: 'ba_1NGFWlJAU9zBfSBORKOpMDdJ'
    
    
    
    
    
            //   const driver = await Driver.findById(req.body.driver)
            //   const bankAccounts = await stripe.customers.listSources(CUSTOMER_ID, {
            //     object: 'bank_account',
            //     limit: 10, // Optional: specify the maximum number of bank accounts to retrieve
            //   });
    
    
            // console.log(paymentIntent, 'iiiiiiiiiiiiiiiiiiiii');
            // const latestCharge = paymentIntent.charges.data[0];
    
            // // Access the receipt URL
            // const receiptUrl = latestCharge.receipt_url;
            // const receipt = await stripe.paymentIntents.retrieveReceipt(paymentIntent.id);
            // console.log(receipt);
    
            // paymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id);
            // const chargeId = paymentIntent.latest_charge;
            // const charge = await stripe.charges.retrieve(chargeId, {
            //   expand: ['receipt_url'],
            // });
            // console.log(charge);
    
    
            //   const bankAccountToken = await stripe.tokens.create({
            //     bank_account: {
            //       country: 'US',
            //       currency: 'usd',
            //       account_holder_name: 'Driver Name',
            //       account_holder_type: 'individual',
            //       routing_number: '110000000',
            //       account_number: '000123456789'
            //     }
            //   });
    
            //   // Create a bank account for the driver using the token
            //   const bankAccount = await stripe.accounts.createExternalAccount(
            //     'driver_stripe_account_id', // Replace with the driver's Stripe account ID
            //     {
            //       external_account: bankAccountToken.id
            //     }
            //   );
    
            //   // Transfer money to the driver's bank account
            //   const transfer = await stripe.transfers.create({
            //     amount: 1000, // $10.00
            //     currency: 'usd',
            //     destination: bankAccount.id
            //   });
    
            res.status(200).json(paymentIntent.status);
    
    
    
        } catch (e) {
            res.status(404).send(e)
        }
    }

    static getUserCards =async (req, res) => {
        const user = await User.findById(req.query.id)
    
        const customerId = user.stripeid
    
        try {
    
            const cards = await stripe.paymentMethods.list({
                customer: customerId,
                type: 'card',
            });
    
    
            res.status(200).json(cards);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static setDefaultCard =  async (req, res) => {
        console.log('workrkrk');
        try {
            let user = await User.findById(req.query.user);
            console.log(req.query.card);
    
            await stripe.customers.update(user.stripeid, { invoice_settings: { default_payment_method: req.query.card } });
    
            res.json({ msg: 'sucessfuly updated' });
    
        } catch (error) {
            res.status(500).json({ error: "Internal server error : " + error.message });
        }
    }

    static deleteCard =   async (req, res) => {
        console.log('workrkrk');
        try {
            await stripe.paymentMethods.detach(
                req.query.card
            );
    
            res.json({ msg: 'sucessfuly updated' });
    
        } catch (error) {
            res.status(500).json({ error: "Internal server error : " + error.message });
        }
    }
    
}

async function createIntent(customer) {
    try {
        const setupIntent = await stripe.setupIntents.create({
            customer: customer,
            automatic_payment_methods: { enabled: true },
        });

        return setupIntent;
    } catch (error) {
        console.error("Error creating customer:", error);
    }
}
async function getCustomer(customerId) {
    try {
        const customer = await stripe.customers.retrieve(customerId);
        return customer;
    } catch (error) {
        return error;
    }
}



module.exports = usersController;
