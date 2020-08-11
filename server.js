const server = express();

const userRouter = require("../users/user-router.js");
const authRouter = require("../auth/auth-router.js");

server.use(helmet());
server.use(express.json());
server.use(cors());


server.use("/api/users", userRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
	res.send("API is UP");
});

module.exports = server;