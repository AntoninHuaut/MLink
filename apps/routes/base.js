const router = require("express").Router();
const controller = require("../controllers/base_c");

router.get("/", controller.base);

module.exports = router;