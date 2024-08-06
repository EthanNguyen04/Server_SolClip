// module.exports = connectDB;
const mongoose = require('mongoose')
require('dotenv').config();

mongoose.set('strictQuery', true)
const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
        })
        console.log('connect successfully')
    } catch (error) {
        console.log(error)
        console.log('connect fail')
    }
};
module.exports = connectDB;