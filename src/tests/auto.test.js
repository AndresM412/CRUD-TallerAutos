const request = require("supertest");
const app = require("../server");
const { datastore } = require("../datastoreConfig");

describe("Auto Controller (Datastore)", () => {
  let testAutoId;

  beforeAll(async () => {
    // Limpiar datos de prueba anteriores
    const query = datastore.createQuery('Auto');
    const [autos] = await datastore.runQuery(query);
    
    const keys = autos.map(auto => auto[datastore.KEY]);
    if (keys.length > 0) {
      await datastore.delete(keys);
    }
  });

  it("debería crear un auto", async () => {
    const res = await request(app)
      .post("/autos")
      .send({ marca: "Toyota", modelo: "Corolla", año: 2020 });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.marca).toBe("Toyota");
    testAutoId = res.body.id;
  });

  it("debería obtener todos los autos", async () => {
    const res = await request(app).get("/autos");
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(auto => auto.marca === "Toyota")).toBe(true);
  });

  it("debería actualizar un auto", async () => {
    const res = await request(app)
      .put(`/autos/${testAutoId}`)
      .send({ marca: "Nissan" });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.marca).toBe("Nissan");
  });

  it("debería eliminar un auto", async () => {
    const res = await request(app)
      .delete(`/autos/${testAutoId}`);
    
    expect(res.statusCode).toBe(204);

    // Verificar que el auto fue eliminado
    const key = datastore.key(['Auto', datastore.int(testAutoId)]);
    const [auto] = await datastore.get(key);
    expect(auto).toBeUndefined();
  });

  it("debería fallar al crear auto sin marca", async () => {
    const res = await request(app)
      .post("/autos")
      .send({ modelo: "Sin Marca", año: 2022 });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("La marca es requerida");
  });

  it("debería fallar al actualizar auto inexistente", async () => {
    const fakeId = '123456'; // ID numérico para Datastore
    const res = await request(app)
      .put(`/autos/${fakeId}`)
      .send({ marca: "Ferrari" });
    
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Auto no encontrado");
  });
});