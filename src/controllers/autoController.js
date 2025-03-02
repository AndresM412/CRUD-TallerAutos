const Auto = require("../models/autoModel");

exports.createAuto = async (req, res) => {
    try {
        const auto = new Auto(req.body);
        await auto.save();
        res.status(201).send(auto);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getAuto = async (req, res) => {
    try {
        const autos = await Auto.find();
        res.status(200).send(autos);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateAuto = async (req, res) => {
    try {
        const auto = await Auto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(auto);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deleteAuto = async (req, res) => {
    try {
        await Auto.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
};