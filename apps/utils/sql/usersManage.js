const sql = require('./index');

exports.isUserCanManage = (userId) => {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query(`select * from usersManage where userId = ?`, [userId], (err, result) => {
            if (err) return reject(false);
            resolve(result.length > 0);
        });
        con.end();
    });
}