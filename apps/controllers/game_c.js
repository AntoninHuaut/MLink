exports.manage = async function (req, res) {
    if (req.session.user.id == "87000718623412224")
        res.render('gameManage', {
            user: req.session.user
        });
    else
        res.render('home', {
            user: req.session.user,
            message: "Vous n'avez pas accès à cette page"
        });
}