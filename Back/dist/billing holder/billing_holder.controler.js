import BillingHolder from './billing_holder.model.js';
export const createBillingHolder = async (req, res) => {
    try {
        let billingHolder;
        billingHolder = new BillingHolder(req.body);
        await billingHolder.save();
        res.send(billingHolder);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('there was an error');
    }
};
export const getBillingHolders = async (req, res) => {
    try {
        const billingHolders = await BillingHolder.find();
        res.json(billingHolders);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('there was an error');
    }
};
export const getBillingHolder = async (req, res) => {
    try {
        let billingHolder = await BillingHolder.findById(req.params.id);
        if (!billingHolder) {
            res.status(404).json({ msg: "billing holder doesn't exist" });
        }
        res.json(billingHolder);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('there was an error');
    }
};
export const getBillingHolderByCUIT = async (req, res) => {
    try {
        const cuit = req.params.cuit;
        const billingHolder = await BillingHolder.findOne({ CUIT: cuit });
        if (!billingHolder) {
            return res.status(404).json({ msg: "Billing holder doesn't exist" });
        }
        res.json(billingHolder);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('There was an error');
    }
};
//# sourceMappingURL=billing_holder.controler.js.map