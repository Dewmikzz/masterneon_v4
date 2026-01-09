const { Schema, model } = require('mongoose')

const neonRequestSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    text: { type: String, maxlength: 30 },
    font: { type: String },
    color: { type: String, required: true },
    size: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    price: { type: Number },
    imagePreview: { type: String },
    pdfBase64: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['new', 'reviewed'], default: 'new' },
  },
  { timestamps: true },
)

module.exports = model('NeonRequest', neonRequestSchema)

