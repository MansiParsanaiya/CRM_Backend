const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    employeeName: { type: String },
    contactNo: { type: Number },
})

const Node = mongoose.model('Node', nodeSchema);
module.exports = Node;