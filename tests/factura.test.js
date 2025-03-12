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

    it("debería manejar errores al crear una factura", async () => {
        const res = await request(app)
            .post("/facturas")
            .send({}); // Envía un objeto vacío para forzar un error
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });

    it("debería manejar errores al obtener facturas", async () => {
        // Simula un error en la base de datos
        jest.spyOn(Factura, "find").mockRejectedValueOnce(new Error("Error de base de datos"));
    
        const res = await request(app).get("/facturas");
        expect(res.statusCode).toEqual(500); // Espera un código de estado 500 (Internal Server Error)
    });

    it("debería manejar errores al actualizar una factura", async () => {
        const res = await request(app)
            .put("/facturas/invalid-id") // Usa un ID inválido
            .send({ monto: 100 });
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });

    it("debería manejar errores al eliminar una factura", async () => {
        const res = await request(app).delete("/facturas/invalid-id"); // Usa un ID inválido
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });

    it("debería manejar errores al eliminar una factura que no existe", async () => {
        const factura = await Factura.create({ numero: 12345, monto: 100.50 });
        await Factura.findByIdAndDelete(factura._id); // Elimina la factura primero
        const res = await request(app).delete(`/facturas/${factura._id}`);
        expect(res.statusCode).toEqual(404); // Espera un código de estado 404 (Not Found)
    });

    it("debería manejar errores al actualizar una factura con datos inválidos", async () => {
        const factura = await Factura.create({ numero: 12345, monto: 100.50 });
        const res = await request(app)
            .put(`/facturas/${factura._id}`)
            .send({ monto: -100 }); // Envía un monto negativo para forzar un error de validación
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });
});