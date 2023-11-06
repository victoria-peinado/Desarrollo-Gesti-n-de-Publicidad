import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://m4rc0sd3ls0l4r:marcosdelsolar@cluster0.03tncxo.mongodb.net/radio');

    console.log('Database connected successfully');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};