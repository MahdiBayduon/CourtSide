const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fieldSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['football', 'tennis', 'paddel', 'basketball'], required: true },
  pricePerHour: { type: Number, required: true },
}, {
  timestamps: true,
});

const Field = mongoose.model('Field', fieldSchema);

module.exports = Field;