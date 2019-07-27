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

router.use((req, res, next) => {
    let gameSelect = req.session.user.gameSelect;
    if (!gameSelect)
        return;

    sql.getInfoGame(gameSelect)
        .catch(err => res.render('home', {
            user: req.session.user,
            message: "Une erreur est survenue"
        }))
        .then(infoGame => {
            infoGame = infoGame[0];
            let canAccess = control.canGamesAccess(req.session.user.id, infoGame.guildId, infoGame.roleId);
            req.session.user.canAccess = canAccess;
            req.session.user.infoGame = infoGame;
            next();
        });
});

router.get("/selectPseudo", controller.selectPseudo);
router.post("/checkSelectPseudo", urlencodedParser, controller.checkSelectPseudo);

module.exports = router;