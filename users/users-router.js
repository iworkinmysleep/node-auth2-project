const router = require("express").Router();

const users = require("./users-model.js");
const restricted = require('../auth/restricted-middleware.js')

router.get("/", restricted, (req, res) => {
	users
		.find()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

module.exports = router;