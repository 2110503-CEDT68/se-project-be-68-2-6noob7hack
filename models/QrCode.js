// models/QrCode.js
const mongoose = require('mongoose');

const QrCodeSchema = new mongoose.Schema(
    {
        coworkingSpace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coworkingspace',
            required: true
        },
        imageData: {
            type: String,   // Base64 encoded image
            required: true
        },
        mimeType: {
            type: String,   // 'image/jpeg' | 'image/png' | 'image/webp'
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('QrCode', QrCodeSchema);