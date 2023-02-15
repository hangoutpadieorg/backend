const { string } = require('joi');
const {Schema, model} = require('mongoose');
const validator = require('validator');

const hongoutcenterSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide hangout center name'],
      },
      email: {
        type: String,
        required: [true, 'Please provide hangout center support email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid hangout center support email address'],
      },
      phoneNumber: {
        type: String,
    },
    address: {
        type: String, 
        required: [true, 'Please prodive the hangout center location address']
    },
    description: {
        type: String,
        required: [true, 'Please provide a short description of hangout center']
    },
    categories: {
        type: String,
        enum: ['Bar', 'Lounge', 'Cafe', 'Restorant', 'Park, Gardens & Reserves', 'Cinemas', 'Tourist Center', 'Beach', 'Gallery'],
        default: 'Bar',
        required: [true, 'Please provide a category']
    },
    openHours: {
        type:String
    },
    gateEntryFee: {
        type: String
    },
    bookingCategory: {
        type: String,
        enum: ['regular', 'vip', 'vvip'],
        default: 'regular'
    },
    image: {
        type: Object,
    },
    
},
{timestamps:true}
)

const HangoutCenter = model('HangoutCenter', hongoutcenterSchema);
module.exports = HangoutCenter;