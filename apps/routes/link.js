const router = require("express").Router();
const controller = require("../controllers/link_c");
const bodyParser = require('body-parser');
const sql = require('../utils/sql');
const control = require('../utils/control');
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});

router.get("/", (req, res) => res.redirect('/link/selectGame'));
router.get("/selectGame", controller.selectGame);
router.post("/checkSelectGame", urlencodedParser, controller.checkSelectGame);

router.use(async (req, res, next) => {
    let gameSelect = req.session.user.gameSelect;
    let infoGame = (await sql.getInfoGame(gameSelect).catch(err => {}))[0];
    
    if (!infoGame)
        return res.redirect('/link');

    let canAccess = control.canGamesAccess(req.session.user.id, infoGame.guildId, infoGame.roleId);
    req.session.user.canAccess = canAccess;
    req.session.user.infoGame = infoGame;
    next();
});

router.get("/selectPseudo", controller.selectPseudo);
router.post("/checkSelectPseudo", urlencodedParser, controller.checkSelectPseudo);

module.exports = router;