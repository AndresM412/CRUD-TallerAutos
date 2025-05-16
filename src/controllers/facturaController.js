const FacturaModel = require('../models/facturaModel');

const facturaController = {
  async crearFactura(req, res) {
    try {
      const { id, ...datos } = req.body;
      const nuevaFactura = await FacturaModel.crearFactura(req.firestore,id, datos);
      res.status(201).json(nuevaFactura);
    } catch (error) {
      console.error('❌ Error al crear factura:', error);
      res.status(500).json({ error: 'Error al crear factura' });
    }
  },

  async obtenerFactura(req, res) {
    try {
      const { id } = req.params;
      const factura = await FacturaModel.obtenerFactura(id);
      if (!factura) {
        return res.status(404).json({ error: 'Factura no encontrada' });
      }
      res.json(factura);
    } catch (error) {
      console.error('❌ Error al obtener factura:', error);
      res.status(500).json({ error: 'Error al obtener factura' });
    }
  },

  async obtenerTodasLasFacturas(req, res) {
    try {
      const facturas = await FacturaModel.obtenerTodasLasFacturas();
      res.json(facturas);
    } catch (error) {
      console.error('❌ Error al obtener facturas:', error);
      res.status(500).json({ error: 'Error al obtener facturas' });
    }
  },

  async actualizarFactura(req, res) {
    try {
      const { id } = req.params;
      const datos = req.body;
      const facturaActualizada = await FacturaModel.actualizarFactura(id, datos);
      res.json(facturaActualizada);
    } catch (error) {
      console.error('❌ Error al actualizar factura:', error);
      res.status(500).json({ error: 'Error al actualizar factura' });
    }
  },

  async eliminarFactura(req, res) {
    try {
      const { id } = req.params;
      await FacturaModel.eliminarFactura(id);
      res.json({ mensaje: 'Factura eliminada exitosamente' });
    } catch (error) {
      console.error('❌ Error al eliminar factura:', error);
      res.status(500).json({ error: 'Error al eliminar factura' });
    }
  }
};

module.exports = facturaController;
