var express = require('express');
var router = express.Router();

/*  listing. */
router.get('/add', function(req, res, next) {
  res.json("Welcome You All");
  /*res.render('addpost', {
  	'title': 'Add Post'
  });*/
  //next();
});

module.exports = router;
