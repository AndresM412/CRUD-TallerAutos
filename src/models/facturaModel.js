const mongoose = require("mongoose");

const facturaSchema = new mongoose.Schema({
    numero: { type: Number, required: true },
    monto: { type: Number, required: true }, // O required: false si no es obligatorio
});

module.exports = mongoose.model("Factura", facturaSchema);