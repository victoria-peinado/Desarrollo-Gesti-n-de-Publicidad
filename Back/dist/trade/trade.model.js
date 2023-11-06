import mongoose from 'mongoose';
const TradeSchema = new mongoose.Schema({
    regDate: {
        type: Date,
        default: Date.now(),
    },
    fantasyName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    billingType: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
    },
    usualPaymentForm: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    /*billingHolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BillingHolder",
      required: true,
    },*/
});
export default mongoose.model('Trade', TradeSchema);
//# sourceMappingURL=trade.model.js.map