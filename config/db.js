// module.exports = connectDB;
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const atlat = "mongodb+srv://thangnvph23924:nTzgvA3JQqrNEMMo@cluster0.sqjfe4h.mongodb.net/video?retryWrites=true&w=majority";
const connectDB = async ()=>{
    try {
        await mongoose.connect(atlat, 
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