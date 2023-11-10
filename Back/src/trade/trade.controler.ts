import BillingHolder from '../billing holder/billing_holder.model.js';
import Trade from './trade.model.js';


export const createTrade = async (req: any, res: any) => {
  try {
    let trade;

    trade = new Trade(req.body);

    await trade.save();
    res.send(trade);
  } catch (error) {
    console.log(error);
    res.status(500).send('there was an error');
  }
};

export const getTrades = async (req: any, res: any) => {
  try {
    const trades = await Trade.find();
    res.json(trades);
  } catch (error) {
    console.log(error);
    res.status(500).send('there was an error');
  }
};

export const getTrade = async (req: any, res: any) => {
  try {
    let trade = await Trade.findById(req.params.id);

    if (!trade) {
      res.status(404).json({ msg: "trade doesn't exist" });
    }

    res.json(trade);
  } catch (error) {
    console.log(error);
    res.status(500).send('there was an error');
  }
};

export const getTradesByBillingHolderId = async (req: any, res: any) => {
  const billingHolderId = req.params.billingHolderId;
  try {
    const trades = await Trade.find({ billingHolderId: billingHolderId });
    res.json(trades);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};

export const getTradesByFantasyNameAndCUIT = async (req: any, res: any) => {
  const { fantasyName, cuit } = req.query;

  try {
    const billingHolder = await BillingHolder.findOne({ CUIT: cuit });

    if (!billingHolder) {
      return res.status(404).json({ msg: 'No se encontró un billingHolder con el CUIT proporcionado.' });
    }

    const trades = await Trade.find({ fantasyName: new RegExp(fantasyName, 'i'), billingHolderId: billingHolder._id });

    res.json(trades);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};