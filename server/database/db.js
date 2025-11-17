import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const USERNAME=process.env.DB_USERNAME;
const PASSWORD=process.env.DB_PASSWORD;

const Connection=async () =>{
    const URL = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.quc5vlc.mongodb.net/test?retryWrites=true&w=majority`;



  
    try{
        await mongoose.connect(URL,{useUnifiedTopology:true});
        console.log("database connected successfully");
    } catch (error){
         console.log("error while connecting with databse",error.message);

    }
}

export default Connection;