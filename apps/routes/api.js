const router = require("express").Router();

router.get("/", require("../controllers/api_c"));

module.exports = router;