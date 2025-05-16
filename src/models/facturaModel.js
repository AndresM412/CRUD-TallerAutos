const collection = 'Factura';

const FacturaModel = {
  async crearFactura(firestore, id, data) {
    const docRef = firestore.collection(collection).doc(id);
    await docRef.set(data);
    return { id, ...data };
  },

  async obtenerFactura(firestore, id) {
    const doc = await firestore.collection(collection).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async obtenerTodasLasFacturas(firestore) {
    const snapshot = await firestore.collection(collection).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async actualizarFactura(firestore, id, data) {
    const docRef = firestore.collection(collection).doc(id);
    await docRef.update(data);
    return { id, ...data };
  },

  async eliminarFactura(firestore, id) {
    await firestore.collection(collection).doc(id).delete();
    return { success: true };
  }
};

module.exports = FacturaModel;
