const express = require("express");
const router = express.Router();
const streamController = require("../controllers/streamControllers");

router.post("/user", streamController.createOrGetUser);
router.post("/room", streamController.createRoom);
router.post("/room/join", streamController.joinRoom);

module.exports = router;
