import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://victoriapeinado:piolin87@cluster0.2m1ohob.mongodb.net/');
        console.log('Database connected successfully');
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map