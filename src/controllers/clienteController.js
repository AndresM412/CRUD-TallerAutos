const Cliente = require("../models/clienteModel");

exports.createCliente = async (req, res) => {
    try {
        const cliente = new Cliente(req.body);
        await cliente.save();
        res.status(201).send(cliente);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.status(200).send(clientes);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateCliente = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre || nombre.trim() === "") {
            return res.status(400).send({ error: "El nombre es requerido" });
        }
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cliente) {
            return res.status(404).send({ error: "Cliente no encontrado" });
        }
        res.status(200).send(cliente);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deleteCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndDelete(req.params.id);
        if (!cliente) {
            return res.status(404).send({ error: "Cliente no encontrado" }); // Cambia 400 por 404
        }
        res.status(204).send();
    } catch (err) {
        res.status(400).send(err);
    }
};