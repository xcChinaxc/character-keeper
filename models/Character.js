const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  game: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  favorite: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }, 
}, {timestamps: true});

module.exports = mongoose.model('Character', CharacterSchema);
