const web = require("express")();
const bodyParser = require("body-parser");
const config = require("./config.json");

global.__basedir = __dirname;

require('./controllers/sql_c').startRun();
require('./discord/');

web.use(bodyParser.json());
web.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
web.use(require("./routes"));

web.listen(config.port, () => {
    console.log("Express port : " + config.port);
});