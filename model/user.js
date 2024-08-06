const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    publickey: {type: String},
    name: {type: String},
    email: {type: String},
    img: {type: String},
},
{
    timestamps: true
})

module.exports = mongoose.model('user', UserSchema)