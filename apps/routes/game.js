const indexRoute = require("./index");
const sql = require("../utils/sql");
const router = require("express").Router();
const controller = require("../controllers/game_c");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});

router.use(async (req, res, next) => {
    let canManage = await sql.isUserCanManage(req.session.user.id);
    if (!canManage)
        return res.render('home', {
            user: req.session.user,
            message: "Vous n'avez pas accès à cette page"
        });

    next();
});

router.get("/", controller.manage);

router.get("/selectGame", controller.selectGame);
router.post("/checkEditGame", urlencodedParser, indexRoute.getLimiter(5000, 1, 429, "Trop grands nombres de requêtes, veuillez réessayer plus tard."), controller.checkEditGame);

router.get("/createGame", controller.createGame);
router.post("/checkSelectGame", urlencodedParser, controller.checkSelectGame);

module.exports = router;