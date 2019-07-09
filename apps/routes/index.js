const express = require("express");
const router = express.Router();

router.use("/", require("./base"));

module.exports = router;