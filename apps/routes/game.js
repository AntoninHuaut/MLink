const router = require("express").Router();
const controller = require("../controllers/game_c");

router.get("/", controller.manage);

module.exports = router;