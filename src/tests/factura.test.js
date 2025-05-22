const request = require("supertest");
const app = require("../server");
const { datastore } = require("../src/datastoreConfig");

describe("Factura Controller", () => {
  beforeAll(async () => {
    // Limpiar datos de prueba
    const query = datastore.createQuery('Factura');
    const [facturas] = await datastore.runQuery(query);
    
    const keys = facturas.map(factura => factura[datastore.KEY]);
    if (keys.length > 0) {
      await datastore.delete(keys);
    }
  });

  it("debería crear una factura", async () => {
    const res = await request(app)
      .post("/facturas")
      .send({ numero: 12345, monto: 100.50 });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.numero).toEqual(12345);
    expect(res.body.monto).toEqual(100.50);
  });

  // ... (otros tests con estructura similar a los anteriores)
});