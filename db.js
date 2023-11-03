const mongoose=require('mongoose');
const dotenv = require("dotenv");
dotenv.config();


const connection=`${process.env.DATABASE}`


const connectToMongo=async()=>{
    return await mongoose.connect(connection) 
}

module.exports=connectToMongo