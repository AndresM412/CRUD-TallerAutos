const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Importar rutas
const clienteRoutes = require("./routes/clienteRoutes");
const autoRoutes = require("./routes/autoRoutes");
const facturaRoutes = require("./routes/facturaRoutes");

const app = express();
app.use(express.json());

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Conectado a MongoDB Atlas"))
.catch((err) => console.error("Error de conexión a MongoDB:", err));

// Usar rutas
app.use("/clientes", clienteRoutes);
app.use("/autos", autoRoutes);
app.use("/facturas", facturaRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});