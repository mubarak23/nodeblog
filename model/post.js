var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title: { type: String, lowercase: true},
	body: {type: String, lowercase: true},
	category: {type: String, lowercase: true},
	author: String,
	date: String,
	mainimage: String
})
module.export = mongoose.model('posts', PostSchema);