const axios = require("axios");
require("dotenv").config();

async function sendMessage(messageContent, destination) {
  try {
    await axios.post(process.env.POST_URL, {
      message: JSON.stringify({
        ...messageContent,
        sendTo: destination
      })
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Source': process.env.SUBSCRIPTION_NAME,
        'X-Destination': 'queue-ms'
      }
    });

    console.log("🚀 Mensaje enviado correctamente a", destination);
  } catch (err) {
    console.error("❌ Error al enviar mensaje:", err.message);
  }
}

module.exports = { sendMessage };
