const ClienteModel = require('../models/clienteModel');

const clienteController = {
  async crearCliente(req, res) {
    try {
      const { id, ...datos } = req.body;
      const nuevoCliente = await ClienteModel.crearCliente(req.firestore, id, datos);
      res.status(201).json(nuevoCliente);
    } catch (error) {
      console.error('❌ Error al crear cliente:', error);
      res.status(500).json({ error: 'Error al crear cliente' });
    }
  },

  async obtenerCliente(req, res) {
    try {
      const { id } = req.params;
      const cliente = await ClienteModel.obtenerCliente(req.firestore, id);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json(cliente);
    } catch (error) {
      console.error('❌ Error al obtener cliente:', error);
      res.status(500).json({ error: 'Error al obtener cliente' });
    }
  },

  async obtenerTodosLosClientes(req, res) {
    try {
      const clientes = await ClienteModel.obtenerTodosLosClientes(req.firestore);
      res.json(clientes);
    } catch (error) {
      console.error('❌ Error al obtener clientes:', error);
      res.status(500).json({ error: 'Error al obtener clientes' });
    }
  },

  async actualizarCliente(req, res) {
    try {
      const { id } = req.params;
      const datos = req.body;
      const clienteActualizado = await ClienteModel.actualizarCliente(req.firestore, id, datos);
      res.json(clienteActualizado);
    } catch (error) {
      console.error('❌ Error al actualizar cliente:', error);
      res.status(500).json({ error: 'Error al actualizar cliente' });
    }
  },

  async eliminarCliente(req, res) {
    try {
      const { id } = req.params;
      await ClienteModel.eliminarCliente(req.firestore, id);
      res.json({ mensaje: 'Cliente eliminado exitosamente' });
    } catch (error) {
      console.error('❌ Error al eliminar cliente:', error);
      res.status(500).json({ error: 'Error al eliminar cliente' });
    }
  }
};

module.exports = clienteController;
