const router = require("express").Router();
const oauth = require('../utils/oauth');

router.get("/", oauth.auth);
router.get("/callback", oauth.token);
router.get("/refresh", oauth.refresh);

module.exports = router;