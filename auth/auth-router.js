const router = require("express").Router();
const bcrypt = require("bcryptjs");
const users = require("../users/users-model.js");

router.post("/register", async (req, res) => {
	let user = req.body;
	const hash = bcrypt.hashSync(user.password, 5);
	user.password = hash;

	try {
		const newUser = await users.add(user);
		res.status(201).json(newUser);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

router.post("/login", (req, res) => {
	let { username, password } = req.body;

	users
		.findBy({ username })
		.first()
		.then((user) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				req.session.user = user;
				res.status(200).json({ message: "Logged In..." });
			} else {
				res.status(401).json({ message: "You shall not pass!" });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.get("/logout", (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				console.log(err);
				res.send("Unable to logout");
			} else {
				res.send("Logged out");
			}
		});
	} else {
		res.end();
	}
});

module.exports = router;