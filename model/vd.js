const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
    publickey: {type: String},
    title: {type: String},
    content: {type: String},
    url: {type: String},
    kol: {type: String}
},
{
    timestamps: true
})

module.exports = mongoose.model('video', VideoSchema)