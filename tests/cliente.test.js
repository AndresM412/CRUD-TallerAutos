const request = require("supertest");
const app = require("../src/server");
const Cliente = require("../src/models/clienteModel");
const mongoose = require("mongoose");

describe("Cliente Controller", () => {
    beforeEach(async () => {
        await Cliente.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("debería crear un cliente", async () => {
        const res = await request(app)
            .post("/clientes")
            .send({ nombre: "Juan Pérez" });
        expect(res.statusCode).toEqual(201);
        expect(res.body.nombre).toEqual("Juan Pérez");
    });

    it("debería obtener todos los clientes", async () => {
        await Cliente.create({ nombre: "Juan Pérez" });
        const res = await request(app).get("/clientes");
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it("debería actualizar un cliente", async () => {
        const cliente = await Cliente.create({ nombre: "Juan Pérez" });
        const res = await request(app)
            .put(`/clientes/${cliente._id}`)
            .send({ nombre: "Carlos Gómez" });
        expect(res.statusCode).toEqual(200);
        expect(res.body.nombre).toEqual("Carlos Gómez");
    });

    it("debería eliminar un cliente", async () => {
        const cliente = await Cliente.create({ nombre: "Juan Pérez" });
        const res = await request(app).delete(`/clientes/${cliente._id}`);
        expect(res.statusCode).toEqual(204);
        const clienteEliminado = await Cliente.findById(cliente._id);
        expect(clienteEliminado).toBeNull();
    });

    it("debería devolver un error si no se encuentra el cliente", async () => {
        const res = await request(app).get("/clientes/invalid-id");
        expect(res.statusCode).toEqual(404);
    });

    it("debería manejar errores al crear un cliente", async () => {
        const res = await request(app)
            .post("/clientes")
            .send({}); // Envía un objeto vacío para forzar un error
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });

    it("debería manejar errores al obtener clientes", async () => {
        // Simula un error en la base de datos
        jest.spyOn(Cliente, "find").mockRejectedValueOnce(new Error("Error de base de datos"));
    
        const res = await request(app).get("/clientes");
        expect(res.statusCode).toEqual(500); // Espera un código de estado 500 (Internal Server Error)
    });

    it("debería manejar errores al actualizar un cliente", async () => {
        const res = await request(app)
            .put("/clientes/invalid-id") // Usa un ID inválido
            .send({ nombre: "Carlos Gómez" });
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });

    it("debería manejar errores al eliminar un cliente", async () => {
        const res = await request(app).delete("/clientes/invalid-id"); // Usa un ID inválido
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });

    it("debería manejar errores al eliminar un cliente que no existe", async () => {
        const cliente = await Cliente.create({ nombre: "Juan Pérez" });
        await Cliente.findByIdAndDelete(cliente._id); // Elimina el cliente primero
        const res = await request(app).delete(`/clientes/${cliente._id}`);
        expect(res.statusCode).toEqual(404); // Espera un código de estado 404 (Not Found)
    });

    it("debería manejar errores al actualizar un cliente con datos inválidos", async () => {
        const cliente = await Cliente.create({ nombre: "Juan Pérez" });
        const res = await request(app)
            .put(`/clientes/${cliente._id}`)
            .send({ nombre: "" }); // Envía un campo vacío para forzar un error de validación
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });
});