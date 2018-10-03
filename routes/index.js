var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', global.authenticationMiddleware(), async function(req, res, next) {
  try {
    let data = await global.conn.query('select * from Notes');    
    res.render('index', { title: 'Index', data: data.recordset });
  }
  catch(ex) {
    res.status(500).json({ "message": "um erro inesperado ocorreu!" });    
  }
});

module.exports = router;
