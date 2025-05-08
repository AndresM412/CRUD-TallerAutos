const express = require("express");
const paso1Controller = require("../controllers/paso1Controller");
const router = express.Router();

router.post("/", paso1Controller.ejecutarPaso1);
router.post("/test-sender", paso1Controller.testSender);

module.exports = router;
