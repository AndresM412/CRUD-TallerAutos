require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Importar rutas
const clienteRoutes = require("./routes/clienteRoutes");
const autoRoutes = require("./routes/autoRoutes");
const facturaRoutes = require("./routes/facturaRoutes");

const app = express();
app.use(express.json());

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado a MongoDB Atlas"))
    .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Usar rutas
app.use("/clientes", clienteRoutes);
app.use("/autos", autoRoutes);
app.use("/facturas", facturaRoutes);

// Exportar la aplicación para usarla en las pruebas
module.exports = app;

// Iniciar el servidor solo si no estamos en un entorno de pruebas
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}