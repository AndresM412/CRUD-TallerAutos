const express = require("express");
const autoController = require("../controllers/autoController");

const router = express.Router();

router.post("/", autoController.createAuto);
router.get("/", autoController.getAuto);
router.put("/:id", autoController.updateAuto);
router.delete("/:id", autoController.deleteAuto);

module.exports = router;