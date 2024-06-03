
async function UpdateSettingsofUser() {
    const settings = require("../settings/settings");
    settingData = await settings()
    stripe_secret_key = settingData.stripe_secret_key 

    try {
        stripe = require("stripe")(
            stripe_secret_key
        );
        const response = await stripe.paymentMethods.list({
            customer: 'cus_OK1C1JLB5rkazJ',
            type: "card",
        });
        console.log(response);
        console.log('work');

        return stripe
    } catch (e) {

        console.log('fuh3fuhf',e.message);

        return {msg:e.message,status:'500'}
    }

}

module.exports = UpdateSettingsofUser