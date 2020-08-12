const jwt = require("jsonwebtoken");
const secrets = require("../config/secret.js");

module.exports = (req, res, next) => {
	const [authType, token] = req.headers.authorization.split(' ');
	console.log("token: ", token);

	if (token) {
		jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
			if (err) {
				res.status(401).json({ message: "invalid token" });
			} else {
				req.decodedJwt = decodedToken;
				next();
			}
		});
	} else {
		res.status(401).json({ message: "You shall not pass! No token included!" });
	}
};
