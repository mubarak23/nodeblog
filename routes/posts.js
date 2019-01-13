var express = require('express');
var router = express.Router();

/*  listing. */
router.get('/add', function(req, res, next) {
	//var categories = db.get('categories');
	//console.log("welcome home");
		res.render('addpost',{
  			'title': 'Add Post'
  		});
	
});

module.exports = router;
