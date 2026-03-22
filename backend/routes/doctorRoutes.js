const express = require("express");
const router = express.Router();

const { doctorLogin } = require("../controllers/doctorController");

router.post("/login", doctorLogin);

module.exports = router;