import mongoose, {connections} from 'mongoose';

if(!process.env.MONGO_URL){
    throw new Error('Please define the MONGO_URL environment variable inside .env.local');
}

const connectDB = async()=>{
    if(connections.length > 0 && connections[0].readyState){
        console.log('Already Connected to Database:', connections[0].name);
        return;
    }
    try{
        await mongoose.connect(process.env.MONGO_URL!);
        if(connections.length > 0 && connections[0].readyState){
            console.log('Connection Successful to Database:', connections[0].name);
        }
    }catch(error: any){
        console.log(error.message);
        throw new Error('Error in Connecting to Database.');
    }
}

export default connectDB;