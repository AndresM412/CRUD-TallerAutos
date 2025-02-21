const express = require("express");
const clienteController = require("../controllers/clienteController");

const router = express.Router();

router.post("/", clienteController.createCliente);
router.get("/", clienteController.getClientes);
router.put("/:id", clienteController.updateCliente);
router.delete("/:id", clienteController.deleteCliente);

module.exports = router;