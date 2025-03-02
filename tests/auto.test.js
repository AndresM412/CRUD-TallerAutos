const request = require("supertest");
const app = require("../src/server"); // Asegúrate de exportar `app` en server.js
const Auto = require("../src/models/autoModel");
const mongoose = require("mongoose"); // Importar mongoose

describe("Auto Controller", () => {
    beforeEach(async () => {
        await Auto.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("debería crear un auto", async () => {
        const res = await request(app)
            .post("/autos")
            .send({ marca: "Toyota" });
        expect(res.statusCode).toEqual(201);
        expect(res.body.marca).toEqual("Toyota");
    });

    it("debería obtener todos los autos", async () => {
        await Auto.create({ marca: "Toyota" });
        const res = await request(app).get("/autos");
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
    });

    it("debería actualizar un auto", async () => {
        const auto = await Auto.create({ marca: "Toyota" });
        const res = await request(app)
            .put(`/autos/${auto._id}`)
            .send({ marca: "Honda" });
        expect(res.statusCode).toEqual(200);
        expect(res.body.marca).toEqual("Honda");
    });

    it("debería eliminar un auto", async () => {
        const auto = await Auto.create({ marca: "Toyota" });
        const res = await request(app).delete(`/autos/${auto._id}`);
        expect(res.statusCode).toEqual(204);
        const autoEliminado = await Auto.findById(auto._id);
        expect(autoEliminado).toBeNull();
    });

    it("debería devolver un error si no se encuentra el auto", async () => {
        const res = await request(app).get("/autos/invalid-id");
        expect(res.statusCode).toEqual(404);
    });
});