import mongoose from 'mongoose';

const BillingHolderSchema = new mongoose.Schema({
  CUIT: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  fiscalCondition: {
    type: String,
    required: true,
  }
});

export default mongoose.model('BillingHolder', BillingHolderSchema);