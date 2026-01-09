const { Schema, model } = require('mongoose')

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String },
    message: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true },
)

module.exports = model('ContactMessage', contactSchema)

