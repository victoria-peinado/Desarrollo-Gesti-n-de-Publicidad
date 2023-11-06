import Trade from './trade.model.js';
export const createTrade = async (req, res) => {
    try {
        let trade;
        trade = new Trade(req.body);
        await trade.save();
        res.send(trade);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('there was an error');
    }
};
export const getTrades = async (req, res) => {
    try {
        const trades = await Trade.find();
        res.json(trades);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('there was an error');
    }
};
export const getTrade = async (req, res) => {
    try {
        let trade = await Trade.findById(req.params.id);
        if (!trade) {
            res.status(404).json({ msg: "trade doesn't exist" });
        }
        res.json(trade);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('there was an error');
    }
};
export const getTradesByBillingHolderId = async (req, res) => {
    const billingHolderId = req.params.billingHolderId;
    try {
        const trades = await Trade.find({ billingHolderId: billingHolderId });
        res.json(trades);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
//# sourceMappingURL=trade.controler.js.map