const collection = 'Auto';

const AutoModel = {
  async crearAuto(firestore, id, data) {
    const docRef = firestore.collection(collection).doc(id);
    await docRef.set(data);
    return { id, ...data };
  },

  async obtenerAuto(firestore, id) {
    const doc = await firestore.collection(collection).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async obtenerTodosLosAutos(firestore) {
    const snapshot = await firestore.collection(collection).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async actualizarAuto(firestore, id, data) {
    const docRef = firestore.collection(collection).doc(id);
    await docRef.update(data);
    return { id, ...data };
  },

  async eliminarAuto(firestore, id) {
    await firestore.collection(collection).doc(id).delete();
    return { success: true };
  }
};

module.exports = AutoModel;
