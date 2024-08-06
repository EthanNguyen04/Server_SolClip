const mongoose = require('mongoose');

const assetCollectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  environment: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imported: { type: Boolean, required: true },
  mintAddress: { type: String },
  created: { type: Number, required: true }
});

module.exports = mongoose.model('AssetCollection', assetCollectionSchema);