const Auto = require("../models/autoModel");

// Crear un auto
exports.createAuto = async (req, res) => {
    try {
        const { marca, modelo, año } = req.body;

        // Validación básica
        if (!marca || marca.trim() === "") {
            return res.status(400).json({ error: "La marca es requerida" });
        }

        const auto = new Auto({ marca, modelo, año });
        await auto.save();
        
        res.status(201).json(auto);
    } catch (err) {
        res.status(400).json({ 
            error: "Error al crear auto",
            details: err.message 
        });
    }
};

// Obtener todos los autos
exports.getAllAutos = async (req, res) => {
    try {
        const autos = await Auto.find();
        res.status(200).json(autos);
    } catch (err) {
        res.status(500).json({ 
            error: "Error al obtener autos",
            details: err.message 
        });
    }
};

// Actualizar un auto
exports.updateAuto = async (req, res) => {
    try {
        const { id } = req.params;
        const { marca, modelo, año } = req.body;

        // Validación
        if (!marca || marca.trim() === "") {
            return res.status(400).json({ error: "La marca es requerida" });
        }

        const auto = await Auto.findByIdAndUpdate(
            id,
            { marca, modelo, año },
            { new: true, runValidators: true }
        );

        if (!auto) {
            return res.status(404).json({ error: "Auto no encontrado" });
        }

        res.status(200).json(auto);
    } catch (err) {
        res.status(400).json({ 
            error: "Error al actualizar auto",
            details: err.message 
        });
    }
};

// Eliminar un auto
exports.deleteAuto = async (req, res) => {
    try {
        const { id } = req.params;
        const auto = await Auto.findByIdAndDelete(id);

        if (!auto) {
            return res.status(404).json({ error: "Auto no encontrado" });
        }

        res.status(204).send();
    } catch (err) {
        res.status(400).json({ 
            error: "Error al eliminar auto",
            details: err.message 
        });
    }
};