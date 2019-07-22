const router = require("express").Router();
const controller = require("../controllers/link_c");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});

router.get("/", (req, res) => res.redirect('/link/selectGame'));
router.get("/selectGame", controller.selectGame);
router.get("/selectPseudo", controller.selectPseudo);

router.post("/checkSelectGame", urlencodedParser, controller.checkSelectGame);
router.post("/checkSelectPseudo", urlencodedParser, controller.checkSelectPseudo);

module.exports = router;