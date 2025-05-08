require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Importar rutas
const clienteRoutes = require("./routes/clienteRoutes");
const autoRoutes = require("./routes/autoRoutes");
const facturaRoutes = require("./routes/facturaRoutes");
const paso1Routes = require("./v2/routes/paso1Routes");

const app = express();
app.use(express.json());

const { startListening } = require('./messageQueue/listener');
startListening();

const connectToDatabase = async () => {
  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Configuración especial para entorno de pruebas
  if (process.env.NODE_ENV === 'test') {
    dbOptions.dbName = `testdb_${process.env.GITHUB_RUN_ID || 'local'}`;
    console.log(`Conectando a base de datos de pruebas: ${dbOptions.dbName}`);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, dbOptions);
    console.log("Conectado a MongoDB Atlas");
    
    // Limpieza inicial solo en pruebas
    if (process.env.NODE_ENV === 'test') {
      await mongoose.connection.db.dropDatabase();
      console.log("Base de datos de pruebas limpiada");
    }
  } catch (err) {
    console.error("Error de conexión a MongoDB:", err);
    process.exit(1); // Salir si hay error de conexión
  }
};

// Conectar a la base de datos
connectToDatabase();

// Usar rutas
app.use("/clientes", clienteRoutes);
app.use("/autos", autoRoutes);
app.use("/facturas", facturaRoutes);
app.use("/api/v2/paso1", paso1Routes);

// Exportar la aplicación para usarla en las pruebas
module.exports = app;

// Iniciar el servidor solo si no estamos en un entorno de pruebas
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}