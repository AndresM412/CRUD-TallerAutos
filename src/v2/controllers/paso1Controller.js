const Cliente = require("../../models/clienteModel");
const Auto = require("../../models/autoModel");
const Factura = require("../../models/facturaModel");
const { sendMessage } = require('../../messageQueue/sender');

exports.testSender = async (req, res) => {
  const data = {
    content: "Mensaje de prueba",
    timestamp: new Date().toISOString()
  };

  await sendMessage(data, "microservice2"); // Puedes cambiar esto al nombre que esperas

  res.json({ message: "Mensaje enviado" });
};

exports.ejecutarPaso1 = async (req, res) => {
  try {
    const { clienteId, autoId, facturaData } = req.body;

    const cliente = await Cliente.findById(clienteId);
    const auto = await Auto.findById(autoId);

    if (!cliente || !auto) {
      return res.status(404).json({ error: "Cliente o Auto no encontrado" });
    }

    const nuevaFactura = new Factura({
      ...facturaData,
      cliente: cliente._id,
      auto: auto._id
    });

    await nuevaFactura.save();

    res.status(201).json({ mensaje: "Paso 1 completado", factura: nuevaFactura });
  } catch (error) {
    console.error("Error en paso1:", error);
    res.status(500).json({ error: "Error procesando el paso 1" });
  }
};
