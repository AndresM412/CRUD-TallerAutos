// src/messageQueue/listener.js
const { ServiceBusClient } = require("@azure/service-bus");
require("dotenv").config();

const connectionString = process.env.CONNECTION_STR;
const topicName = process.env.TOPIC_NAME;
const subscriptionName = process.env.SUBSCRIPTION_NAME;

async function startListening() {
  const sbClient = new ServiceBusClient(connectionString);
  const receiver = sbClient.createReceiver(topicName, subscriptionName);

  receiver.subscribe({
    processMessage: async (message) => {
      const data = JSON.parse(message.body);
      console.log("📨 Mensaje recibido:", data);

      if (data.sendTo === subscriptionName) {
        console.log("✅ Procesando mensaje en microservice1");
        // Aquí puedes hacer algo con los datos recibidos
      }
    },
    processError: async (err) => {
      console.error("❌ Error en el recibir:", err);
    }
  });

  console.log(`🟢 Escuchando mensajes para: ${subscriptionName}`);
}

module.exports = { startListening };
