const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
});

module.exports = mongoose.model("Cliente", clienteSchema);