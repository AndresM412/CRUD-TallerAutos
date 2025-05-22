const request = require("supertest");
const app = require("../src/server");
const { datastore } = require("../src/datastoreConfig");

describe("Cliente Controller", () => {
  let testClienteId;

  beforeAll(async () => {
    // Limpiar datos de prueba
    const query = datastore.createQuery('Cliente');
    const [clientes] = await datastore.runQuery(query);
    
    const keys = clientes.map(cliente => cliente[datastore.KEY]);
    if (keys.length > 0) {
      await datastore.delete(keys);
    }
  });

  it("debería crear un cliente", async () => {
    const res = await request(app)
      .post("/clientes")
      .send({ nombre: "Juan Pérez" });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.nombre).toEqual("Juan Pérez");
    testClienteId = res.body.id;
  });

  it("debería obtener todos los clientes", async () => {
    // Crear un cliente de prueba
    const key = datastore.key('Cliente');
    await datastore.save({
      key,
      data: { nombre: "Cliente Test" }
    });
    
    const res = await request(app).get("/clientes");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("debería actualizar un cliente", async () => {
    const key = datastore.key('Cliente');
    await datastore.save({
      key,
      data: { nombre: "Nombre Original" }
    });
    const clienteId = key.id;
    
    const res = await request(app)
      .put(`/clientes/${clienteId}`)
      .send({ nombre: "Nombre Actualizado" });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.nombre).toEqual("Nombre Actualizado");
  });

  it("debería eliminar un cliente", async () => {
    const key = datastore.key('Cliente');
    await datastore.save({
      key,
      data: { nombre: "Cliente a Eliminar" }
    });
    const clienteId = key.id;
    
    const res = await request(app).delete(`/clientes/${clienteId}`);
    expect(res.statusCode).toEqual(204);
    
    // Verificar eliminación
    const [cliente] = await datastore.get(key);
    expect(cliente).toBeUndefined();
  });

  // ... (otros tests se mantienen similares con ajustes en los IDs)
});