const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/', clienteController.crearCliente);
router.get('/', clienteController.obtenerTodosLosClientes);
router.get('/:id', clienteController.obtenerCliente);
router.put('/:id', clienteController.actualizarCliente);
router.delete('/:id', clienteController.eliminarCliente);

module.exports = router;
