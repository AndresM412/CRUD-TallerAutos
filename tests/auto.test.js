const request = require("supertest");
const app = require("../src/server");
const Auto = require("../src/models/autoModel");
const mongoose = require("mongoose");

describe("Auto Controller", () => {
    let testAuto;

    // Antes de todas las pruebas, crea un auto de prueba
    beforeAll(async () => {
        testAuto = await Auto.create({ 
            marca: "Toyota", 
            modelo: "Corolla", 
            año: 2020 
        });
    });

    // Después de todas las pruebas, limpia la base de datos
    afterAll(async () => {
        await Auto.deleteMany({});
        await mongoose.connection.close();
    });

    // Prueba: Crear un auto
    it("debería crear un auto", async () => {
        const res = await request(app)
            .post("/autos")
            .send({ marca: "Honda", modelo: "Civic", año: 2021 });
        
        expect(res.statusCode).toBe(201);
        expect(res.body.marca).toBe("Honda");
    });

    // Prueba: Obtener todos los autos
    it("debería obtener todos los autos", async () => {
        const res = await request(app).get("/autos");
        
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body.some(auto => auto.marca === "Toyota")).toBe(true);
    });

    // Prueba: Actualizar un auto
    it("debería actualizar un auto", async () => {
        const res = await request(app)
            .put(`/autos/${testAuto._id}`)
            .send({ marca: "Nissan" });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.marca).toBe("Nissan");
    });

    // Prueba: Eliminar un auto
    it("debería eliminar un auto", async () => {
        const res = await request(app)
            .delete(`/autos/${testAuto._id}`);
        
        expect(res.statusCode).toBe(204);

        // Verifica que el auto fue eliminado
        const autoEliminado = await Auto.findById(testAuto._id);
        expect(autoEliminado).toBeNull();
    });

    // Prueba: Manejo de errores al crear auto sin marca
    it("debería fallar al crear auto sin marca", async () => {
        const res = await request(app)
            .post("/autos")
            .send({ modelo: "Sin Marca", año: 2022 });
        
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("La marca es requerida");
    });

    // Prueba: Manejo de errores al actualizar auto inexistente
    it("debería fallar al actualizar auto inexistente", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .put(`/autos/${fakeId}`)
            .send({ marca: "Ferrari" });
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Auto no encontrado");
    });
});