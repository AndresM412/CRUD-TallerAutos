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
        const { marca } = req.body;
        if (!marca || marca.trim() === "") {
            return res.status(400).send({ error: "La marca es requerida" });
        }
        const auto = await Auto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!auto) {
            return res.status(404).send({ error: "Auto no encontrado" });
        }
        res.status(200).send(auto);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deleteAuto = async (req, res) => {
    try {
        const auto = await Auto.findByIdAndDelete(req.params.id);
        if (!auto) {
            return res.status(404).send({ error: "Auto no encontrado" }); // Cambia 400 por 404
        }
        res.status(204).send();
    } catch (err) {
        res.status(400).send(err);
    }
};