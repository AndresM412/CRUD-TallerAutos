const mongoose = require("mongoose");

const facturaSchema = new mongoose.Schema({
    monto: { type: Number, required: true },
});

module.exports = mongoose.model("Factura", facturaSchema);