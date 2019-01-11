var monk = require('monk');

var PostSchema = new monk.Schema({
	title: { type: String, lowercase: true},
	body: {type: String, lowercase: true},
	category: {type: String, lowercase: true}
	author: String,
	date: String
})
module.export = mongoose.model('posts', PostSchema);