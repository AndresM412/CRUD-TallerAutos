const request = require("supertest");
const app = require("../src/server");
const Factura = require("../src/models/facturaModel");
const mongoose = require("mongoose"); // Importar mongoose

describe("Factura Controller", () => {
    beforeEach(async () => {
        await Factura.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("debería crear una factura", async () => {
        const res = await request(app)
            .post("/facturas")
            .send({ numero: 12345, monto: 100.50 }); // Añadir el campo monto
        expect(res.statusCode).toEqual(201);
        expect(res.body.numero).toEqual(12345);
        expect(res.body.monto).toEqual(100.50);
    });

    it("debería obtener todas las facturas", async () => {
        await Factura.create({ numero: 12345, monto: 100.50 }); // Añadir el campo monto
        const res = await request(app).get("/facturas");
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
    });

    it("debería actualizar una factura", async () => {
        const factura = await Factura.create({ numero: 12345, monto: 100.50 }); // Añadir el campo monto
        const res = await request(app)
            .put(`/facturas/${factura._id}`)
            .send({ numero: 54321, monto: 200.00 }); // Añadir el campo monto
        expect(res.statusCode).toEqual(200);
        expect(res.body.numero).toEqual(54321);
        expect(res.body.monto).toEqual(200.00);
    });

    it("debería eliminar una factura", async () => {
        const factura = await Factura.create({ numero: 12345, monto: 100.50 }); // Añadir el campo monto
        const res = await request(app).delete(`/facturas/${factura._id}`);
        expect(res.statusCode).toEqual(204);
        const facturaEliminada = await Factura.findById(factura._id);
        expect(facturaEliminada).toBeNull();
    });

    it("debería devolver un error si no se encuentra la factura", async () => {
        const res = await request(app).get("/facturas/invalid-id");
        expect(res.statusCode).toEqual(404);
    });
});