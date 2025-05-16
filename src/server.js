require("dotenv").config();
const express = require("express");
const { firestore, testConnection } = require('../firestoreConfig');

console.log('Proyecto detectado:', firestore.projectId);


const app = express();
app.use(express.json());

// Middleware async para inicialización
app.use(async (req, res, next) => {
  try {
    req.firestore = firestore;
    next();
  } catch (err) {
    next(err);
  }
});

const startServer = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to Firestore');
    }

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Firestore connected to project: crud-autos-project`);
    });

    process.on('SIGTERM', () => {
      server.close(() => console.log('Server closed (SIGTERM)'));
    });

    process.on('SIGINT', () => {
      server.close(() => {
        console.log('Server closed (Ctrl+C)');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
};

// Importar rutas
const clienteRoutes = require("./routes/clienteRoutes");
const autoRoutes = require("./routes/autoRoutes");
const facturaRoutes = require("./routes/facturaRoutes");
const paso1Routes = require("./v2/routes/paso1Routes");

app.use("/clientes", clienteRoutes);
app.use("/autos", autoRoutes);
app.use("/facturas", facturaRoutes);
app.use("/api/v2/paso1", paso1Routes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Iniciar servidor
startServer();