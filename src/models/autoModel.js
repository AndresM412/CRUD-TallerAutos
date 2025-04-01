const mongoose = require("mongoose");

const autoSchema = new mongoose.Schema({
    marca: { 
        type: String, 
        required: true 
    },
    modelo: {
        type: String,
        required: true
    },
    año: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Auto", autoSchema);