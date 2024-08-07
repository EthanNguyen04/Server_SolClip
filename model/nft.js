const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
from: { type: Number, required: true }, 
  to: { type: Number, required: true }   
});

const NFT = mongoose.model('NFT', NFTSchema);

module.exports = NFT;
