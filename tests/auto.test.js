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
        expect(res.body.length).toBeGreaterThanOrEqual(1);
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

    it("debería manejar errores al crear un auto", async () => {
        // Simula un error de validación enviando un objeto vacío
        const res = await request(app)
            .post("/autos")
            .send({}); // Envía un objeto vacío para forzar un error
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });

    it("debería manejar errores al obtener autos", async () => {
        // Simula un error en la base de datos
        jest.spyOn(Auto, "find").mockRejectedValueOnce(new Error("Error de base de datos"));
    
        const res = await request(app).get("/autos");
        expect(res.statusCode).toEqual(500); // Espera un código de estado 500 (Internal Server Error)
    });

    it("debería manejar errores al actualizar un auto", async () => {
        const res = await request(app)
            .put("/autos/invalid-id") // Usa un ID inválido
            .send({ marca: "Honda" });
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });

    it("debería manejar errores al eliminar un auto", async () => {
        const res = await request(app).delete("/autos/invalid-id"); // Usa un ID inválido
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });

    it("debería manejar errores al eliminar un auto que no existe", async () => {
        const auto = await Auto.create({ marca: "Toyota" });
        await Auto.findByIdAndDelete(auto._id); // Elimina el auto primero
        const res = await request(app).delete(`/autos/${auto._id}`);
        expect(res.statusCode).toEqual(404); // Espera un código de estado 404 (Not Found)
    });

    it("debería manejar errores al actualizar un auto con datos inválidos", async () => {
        const auto = await Auto.create({ marca: "Toyota" });
        const res = await request(app)
            .put(`/autos/${auto._id}`)
            .send({ marca: "" }); // Envía un campo vacío para forzar un error de validación
        expect(res.statusCode).toEqual(400); // Espera un código de estado 400 (Bad Request)
    });
});