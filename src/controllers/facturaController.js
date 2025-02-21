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
        const factura = await Factura.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(factura);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deleteFactura = async (req, res) => {
    try {
        await Factura.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
};