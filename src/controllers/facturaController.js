const Factura = require("../models/facturaModel");

exports.createFactura = async (req, res) => {
    try {
        const factura = new Factura(req.body);
        await factura.save();
        res.status(201).send(factura);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getFactura = async (req, res) => {
    try {
        const facturas = await Factura.find();
        res.status(200).send(facturas);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateFactura = async (req, res) => {
    try {
        const { monto } = req.body;
        if (!monto || monto < 0) {
            return res.status(400).send({ error: "El monto debe ser un valor positivo" });
        }
        const factura = await Factura.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!factura) {
            return res.status(404).send({ error: "Factura no encontrada" });
        }
        res.status(200).send(factura);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deleteFactura = async (req, res) => {
    try {
        const factura = await Factura.findByIdAndDelete(req.params.id);
        if (!factura) {
            return res.status(404).send({ error: "Factura no encontrada" }); // Cambia 400 por 404
        }
        res.status(204).send();
    } catch (err) {
        res.status(400).send(err);
    }
};