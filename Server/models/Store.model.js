const mongoose = require('mongoose');
const IBSSuperAdmin = require('../models/superAdmin.model');
const MonthlyPaymentSchema = new mongoose.Schema({
  year: Number,
  month: {
    type: String,
    enum: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
  },
  amount: Number,

});
const StoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IBSSuperAdmin',
        required: true
    },
    month: {
        type: String, // e.g., "2024-06"
        required: true
    },
    monthlyPayment:[MonthlyPaymentSchema],
    totalInstallmentsCollected: {
        type: Number,
        required: true
    },
    standingBalance: {
        type: Number,
        required: true
    },
    balanceFromPreviousMonths: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: 'storeDetails'
});

module.exports = mongoose.model('IBSstore', StoreSchema);