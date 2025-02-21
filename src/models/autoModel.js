const mongoose = require("mongoose");

const autoSchema = new mongoose.Schema({
    marca: { type: String, required: true },
});

module.exports = mongoose.model("Auto", autoSchema);