const AutoModel = require('../models/autoModel');

const autoController = {
  async getAutos(req, res) {
    try {
      const autos = await AutoModel.getAutos(req.firestore);
      res.render('autos', { autos });
    } catch (error) {
      console.error('❌ Error al obtener autos:', error);
      res.status(500).json({ error: 'Error al obtener autos' });
    }
  },

  async getAutoById(req, res) {
    try {
      const auto = await AutoModel.getAutoById(req.firestore, req.params.id);
      if (!auto) {
        return res.status(404).json({ error: 'Auto no encontrado' });
      }
      res.render('auto-detail', { auto });
    } catch (error) {
      console.error('❌ Error al obtener auto:', error);
      res.status(500).json({ error: 'Error al obtener auto' });
    }
  },

  async createAuto(req, res) {
    try {
      const id = await AutoModel.createAuto(req.firestore, req.body);
      res.redirect('/autos/' + id);
    } catch (error) {
      console.error('❌ Error al crear auto:', error);
      res.status(500).json({ error: 'Error al crear auto' });
    }
  },

  async updateAuto(req, res) {
    try {
      await AutoModel.updateAuto(req.firestore, req.params.id, req.body);
      res.sendStatus(200);
    } catch (error) {
      console.error('❌ Error al actualizar auto:', error);
      res.status(500).json({ error: 'Error al actualizar auto' });
    }
  },

  async deleteAuto(req, res) {
    try {
      await AutoModel.deleteAuto(req.firestore, req.params.id);
      res.sendStatus(204);
    } catch (error) {
      console.error('❌ Error al eliminar auto:', error);
      res.status(500).json({ error: 'Error al eliminar auto' });
    }
  }
};

module.exports = autoController;
