// models/QrCode.js
const mongoose = require('mongoose');

const QrCodeSchema = new mongoose.Schema(
    {
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
            required: true
        },
        coworkingSpace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coworkingspace',
            required: true
        },
        imageBase64: {
            type: String,
            required: true
        },
        payload: {
            type: String,   // the raw JSON string encoded in the QR — used for verification
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        usedAt: {
            type: Date,
            default: null   // set when scanned & confirmed
        },
        isUsed: {
            type: Boolean,
            default: false
        },
        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Convenience: check expiry without pulling the whole doc
QrCodeSchema.virtual('isExpired').get(function () {
    return new Date() > this.expiresAt;
});

QrCodeSchema.set('toJSON', { virtuals: true });
QrCodeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('QrCode', QrCodeSchema);