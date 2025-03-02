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
        expect(res.body.length).toEqual(1);
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
});