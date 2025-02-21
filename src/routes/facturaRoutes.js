const express = require("express");
const facturaController = require("../controllers/facturaController");

const router = express.Router();

router.post("/", facturaController.createFactura);
router.get("/", facturaController.getFactura);
router.put("/:id", facturaController.updateFactura);
router.delete("/:id", facturaController.deleteFactura);

module.exports = router;