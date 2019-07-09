const router = require("express").Router();

router.get("/:typeGame?/:typeObject?/:idServer?", require("../controllers/base_c"));

module.exports = router;