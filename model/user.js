const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    publickey: {type: String},
    name: {type: String},
    email: {type: String},
    img: {type: String},
    useNft: {type: String},
    from: {type: Number},
    to: {type: Number}
},
{
    timestamps: true
})

module.exports = mongoose.model('user', UserSchema)