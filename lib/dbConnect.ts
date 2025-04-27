import mongoose from 'mongoose';

if (!process.env.MONGO_URL) {
    throw new Error('Please define the MONGO_URL environment variable inside .env.local');
}

const connectDB = async () => {
    // Check if already connected using mongoose.connection
    if (mongoose.connection.readyState) {
        console.log('Already Connected to Database:', mongoose.connection.name);
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        if (mongoose.connection.readyState) {
            console.log('Connection Successful to Database:', mongoose.connection.name);
        }
    } catch (error: any) {
        console.log(error.message);
        throw new Error('Error in Connecting to Database.');
    }
}

export default connectDB;
