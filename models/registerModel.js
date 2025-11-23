const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const registerSchema = new mongoose.Schema({
    employeeID: { type: Number, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, enum: ['Admin', 'Manager', 'Employee'], default: null },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: Number },
    address: { type: String },
    gender: { type: String, enum: ['Male', 'Female'], default: null },
    dob: { type: Date },
    contactNo: { type: Number },
    profileImage: { type: String },
    createdAt: { type: Date, default: Date.now },
});

registerSchema.plugin(mongoosePaginate);
const Register = mongoose.model('Register', registerSchema);
module.exports = Register;