const router = require("express").Router();
const bcrypt = require("bcryptjs");
const users = require("../users/users-model.js");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secret.js");

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
		.then(([user]) => {
		
			if (user && bcrypt.compareSync(password, user.password)) {
				//generate token
				const token = generateToken(user);
				res.status(200).json({ message: "Logged In...", token });
			} else {
				res.status(401).json({ message: "You shall not pass!" });
			}
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

function generateToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
		department: user.department,
	};

	const options = {
		expiresIn: "4h",
	};

	const secret = secrets.jwtSecret;

	return jwt.sign(payload, secret, options);
}

module.exports = router;
