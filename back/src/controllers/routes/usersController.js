const User = require("../../model/user");
const { sendMail } = require("../../utils/email");
const { sendSMS } = require("../../utils/sms");

let stripe
async function aa (){
  
   stripe = await require("../stripe/stripe")()
  // console.log(stripe);
  
}
aa()
// let stripe_secret_key

// let stripe


// async function UpdateSettingsofUser(){
//   const settings = require("../settings/settings");
//    settingData = await settings()
//    stripe_secret_key = settingData.stripe_secret_key 
  
//    stripe = require("stripe")(
//     stripe_secret_key
//   );


// }
// UpdateSettingsofUser()
class usersController {
  static addUser = async (req, res) => {

    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError.message });
    }
    if (req.file) {
      req.body.avatar = req.file.filename;
    } else {
      req.body.avatar = "default.jpeg";
    }

    try {
      const customer = await stripe.customers.create({ email: req.body.email });
      req.body["stripeid"] = customer.id;

      const user = new User(req.body);

      
     let ress =  await user.save();
     let emailError = await sendMail("jaykanani28887@gmail.com", "Welcome", "welcome to Godrive");
     let er = await sendSMS("+917043714531", "welcome to Godrive");

     
      if(emailError){
        await res.status(200).json({ msg:'User Added Successfully But' + emailError});
        return
       }
      if(er){
        console.log('msg errr');
        await res.status(200).json({ msg:'User Added Successfully But ' + er});
        return

      }
      await res.status(200).json({ user, customer,msg:"User Added Successfully" });
    } catch (e) {


      
      let errors = {msg:"Something Went Wrong"};

      if (e.keyPattern?.email && e.keyValue?.email) {
        errors.email = "email already exist";
      } else if (e.keyPattern?.mobile && e.keyValue) {
        errors.number = "number already exist";
      }
      res.status(400).send(errors);
    }
  };

  static getUsers = async (req, res) => {
    let regext;
    let data;
    let sortCriteria;

    const currentPage = req.query.page || 1;
    const limits = req.query.size || 3;

    console.log("currentPage", req.query);

    if (req.query.field !== undefined ) {
      console.log(req.query.field);
      const field = req.query.field;
      sortCriteria = {};
      sortCriteria[field] = 1;

    } else {
      console.log('nai');
      sortCriteria = { name: -1 };
    }

    try {
      let pipeline = [
        {
          $lookup: {
            from: "countries", // Name of the SUV collection
            localField: "country",
            foreignField: "_id",
            as: "country",
          },
        },
        {
          $unwind: "$country",
        },

        {
          $facet: {
            documents: [
              { $match: {} },

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
              { $count: "total" }, // Count the documents
            ],
          },
        },
      ];

      if (req.query.str) {
        const str = req.query.str;
        regext = new RegExp(str, "i");
        pipeline.splice(2, 0, {
          $match: {
            $or: [
              // {_id: new mongoose.Types.ObjectId(str)},
              { name: regext },
              { mobile: regext },
              { email: regext },
              { "country.name": regext },
              { "city.city": regext },
              { "vehicle.name": regext },
            ],
          },
        });
      }

      data = await User.aggregate(pipeline);

      if(data[0]?.count.length === 0){
        res.status(400).send({msg:"Added USer's List Not Found"})
        return
      }
      let totalCounts = data[0]?.count[0]?.total;

      const pages = Math.ceil(totalCounts / limits);

      res.status(200).send({
        count: totalCounts,
        users: data[0].documents,
        pages,
        msg:"Added USer's List Found"
      });
    } catch (e) {
      console.log(e);
      res.status(400).send({msg:"Something Went Wrong"});
    }
  };

  static deleteUser = async (req, res) => {
    try {
      let user = await User.findOneAndRemove({ _id: req.params.id });

      if(!user){
        res.status(400).send({msg:"User's Data Not Found"})
        return
      }

      res.status(200).send({user,msg:"User Deleted"});
    } catch (e) {
      console.log(e);
      res.status(404).send({msg:"Something Went Wrong"});
    }
  };

  static getAddedUser = async (req, res) => {
    try {
      let user = await User.findOne({ mobile: req.body.number });
      let customer = await getCustomer(user.stripeid)
      if (!user || !customer) {
        res.status(400).send({msg:"User Not Rigistered"});

        return;
      }
      res.status(200).send({user,msg:"User's Details Found",customer:customer.invoice_settings.default_payment_method});

    } catch (e) {
      console.log(e);
     let  errors = {msg:"Something Went Wrong"};

     res.status(400).send(errors)
    }
  };

  static saveUpdatedUser = async (req, res) => {

  
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError.message });
    }
    if (req.file) {
      req.body.avatar = req.file.filename;
    } 
    try {
      const user = await User.findByIdAndUpdate(req.query.id, req.body, {
        new: true,
        runValidators: true,
      });
      if(!user){
        res.status(400).send({msg:"User's Data Not Found"})
        return
      }
      res.status(400).send({user,msg:"User's Deatails Updated Successfully"});
    } catch (e) {
      let errors = {msg:"Something Went Wrong"};

      if (e.keyPattern?.email && e.keyValue?.email) {
        errors.email = "email already exist";
      } else if (e.keyPattern?.mobile && e.keyValue) {
        errors.number = "number already exist";
      }
      res.status(400).send(errors);
      console.log(e);
    }
  };

  static getDetailForUpdate = async (req, res) => {
    try {
      const user = await User.findById(req.query.id);
      let customer = await getCustomer(user.stripeid)


      if(!user || !customer){
        res.status(400).send({msg:"User's Data Not Found"})
        return
      }

      await res.status(200).json({ user,msg:"User's Data Found" ,customer});
    } catch (e) {
      res.status(400).send({msg:"Something Went Wrong"});
    }
  };

  static addUserCard = async (req, res) => {
    try {
    
      const user = await User.findById(req.query.id);
      if(!user ){
        res.status(400).send({msg:"User's Data Not Found"})
        return
      }


      await stripe.paymentMethods.attach(req.body.id, {
        customer: user.stripeid,
      });
      // await stripe.customers.update(user.stripeid, { invoice_settings: { default_payment_method: req.body.id } });

      res.status(200).json({ msg: "Card sucessfully added" });
    } catch (e) {
      res.status(404).send({ msg: "Something Went Wrong" });
    }
  };

  static getPaymentFromUser = async (req, res) => {
    const user = await User.findById(req.query.userid);

    try {
      let paymentIntent = await stripe.paymentIntents.create({
        amount: req.query.amount,
        currency: "usd",
        payment_method_types: ["card"],
        payment_method: req.query.card, // replace with your payment method ID
        customer: user.stripeid, // replace with your customer ID
        confirm: true,
      });
      if(!paymentIntent){
        res.status(400).send({msg:"Something Went Wrong"})
        return
      }
      
      // try {
      //   const transfer = await stripe.transfers.create({
      //     amount: req.query.amount, // Amount in cents/pennies
      //     currency: "usd",
      //     destination: "ba_1NGFWlJAU9zBfSBORKOpMDdJ",
      //   });
      //   console.log("Transfer ID:", transfer.id);
      //   console.log("Transfer status:", transfer.status);
      // } catch (error) {
      //   console.error("Transfer error:", error);
      // }

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
      res.status(404).send(e);
    }
  };

  static getUserCards = async (req, res) => {
    const user = await User.findById(req.query.id);
    
    const customerId = user.stripeid;

    try {
      
      if(stripe.status==500){
        res.status(400).send({msg:stripe.msg})
        return

      }
      const cards = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      if(cards.length === 0 ){
        res.status(400).send({msg:"User's Added Cards Not Found"})
        return
      }

      res.status(200).json({cards,msg:"User's Added Cards Found"});
    } catch (error) {
      console.log(error.message,'jofwejf');
      res.status(400).json({ error: error.message,msg:"Something Went Wrong" });
    }
  };

  static setDefaultCard = async (req, res) => {
    console.log("workrkrk");
    try {
      let user = await User.findById(req.query.user);

      if(!user){
        res.status(400).send({msg:"User's Data Not Found"})
      }

      await stripe.customers.update(user.stripeid, {
        invoice_settings: { default_payment_method: req.query.card },
      });

      res.json({ msg: "Card sucessfuly updated" });
    } catch (error) {
      res
        .status(400)
        .json({ error: "Internal server error : " + error.message });
    }
  };

  static deleteCard = async (req, res) => {
    console.log("workrkrk");
    try {
      await stripe.paymentMethods.detach(req.query.card);

      res.json({ msg: "Card Deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal server error : " + error.message });
    }
  };
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

module.exports = {usersController,
  // UpdateSettingsofUser

}