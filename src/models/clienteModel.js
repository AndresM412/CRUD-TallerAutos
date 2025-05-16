const collection = 'Clientes';

const ClienteModel = {
  async crearCliente(firestore, id, data) {
    const docRef = firestore.collection(collection).doc(id);
    await docRef.set(data);
    return { id, ...data };
  },

  async obtenerCliente(firestore, id) {
    const doc = await firestore.collection(collection).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async obtenerTodosLosClientes(firestore) {
    const snapshot = await firestore.collection(collection).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async actualizarCliente(firestore, id, data) {
    const docRef = firestore.collection(collection).doc(id);
    await docRef.update(data);
    return { id, ...data };
  },

  async eliminarCliente(firestore, id) {
    await firestore.collection(collection).doc(id).delete();
    return { success: true };
  }
};

module.exports = ClienteModel;