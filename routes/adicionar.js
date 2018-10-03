var express = require('express');
var router = express.Router();

router.get('/', global.authenticationMiddleware(), async (req, res, next) => {
    try {
        let data = await global.conn.query('select * from Indigo_Usuarios');
        console.log(data.recordsets[0]);
        res.render('adicionar', { Users: data.recordsets[0] })
    }
    catch(ex) {
        console.log(ex);
    }
});

router.post('/', global.authenticationMiddleware(), async (req, res, nex) => {    
    try {
        let insertQuery = `insert into Notes (RemainingUserID, RemainingUserName, CardContent, TargetUserName, CardColorHex) values (${req.user.ID}, '${req.user.Nome}', '${req.body.CardContent}', '${req.body.para}', '#2196f3');`;
        console.log(insertQuery);
        let data = global.conn.query(insertQuery);
        console.log(data);
    }
    catch(ex) {
        console.log(ex);
    }

    res.status(204).redirect('/index');
});

module.exports = router;