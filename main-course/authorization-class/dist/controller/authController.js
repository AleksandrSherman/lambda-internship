import { Controller } from "./base.js";
import bcrypt from "bcrypt";
const SECRET_KEY = process.env.SECRET_KEY;
export class AuthController extends Controller {
    constructor(authService) {
        super("/auth");
        this.authService = authService;
        this.signUp = async (req, res) => {
            const { email, password } = req.body;
            if (typeof email === "undefined") {
                return res
                    .status(400)
                    .json({ error: "Body should contain 'email' parameter" });
            }
            if (typeof password === "undefined") {
                return res
                    .status(400)
                    .json({ error: "Body should contain 'password' parameter" });
            }
            if (email.length < 5 || password.length < 5) {
                return res.status(400).json({
                    error: "'Email' and 'password' should be more than 4 symbols",
                });
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const userInformation = { email, password: hash };
            const user = await this.authService.getUserByEmail(email);
            if (typeof user !== "undefined") {
                return res
                    .status(400)
                    .json({ error: "Current email is already registered" });
            }
            const createdUserId = await this.authService.createUser(userInformation);
            const tokens = this.authService.generateJwtTokens(createdUserId);
            return res.status(200).json(tokens);
        };
        this.login = async (req, res) => {
            const { email, password } = req.body;
            if (typeof email === "undefined") {
                return res
                    .status(400)
                    .json({ error: "Body should contain 'email' parameter" });
            }
            if (typeof password === "undefined") {
                return res
                    .status(400)
                    .json({ error: "Body should contain 'password' parameter" });
            }
            const userInformation = await this.authService.getUserByEmail(email);
            if (typeof userInformation === "undefined") {
                return res
                    .status(400)
                    .json({ error: "This password or email is invalid" });
            }
            const isValidPassword = bcrypt.compareSync(password, userInformation.password);
            if (!isValidPassword) {
                return res
                    .status(400)
                    .json({ error: "This password or email is invalid" });
            }
            const tokens = this.authService.generateJwtTokens(userInformation._id?.toString());
            return res.status(200).json(tokens);
        };
        this.refresh = (req, res) => {
            const authorizationHeader = req.headers.authorization;
            try {
                if (typeof authorizationHeader === "undefined") {
                    throw Error("Unauthorized");
                }
                if (authorizationHeader.split(" ").length !== 2 ||
                    authorizationHeader.split(" ")[0] !== "Bearer") {
                    throw Error("Unauthorized");
                }
                const refreshToken = authorizationHeader.split(" ")[1];
                const decodedToken = this.authService.checkIfValidToken(refreshToken);
                const tokens = this.authService.generateJwtTokens(decodedToken._id);
                return res.status(200).json(tokens);
            }
            catch (err) {
                return res.status(400).json({ error: err.message });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/sign-up", this.signUp);
        this.router.post("/login", this.login);
        this.router.post("/refresh", this.refresh);
    }
}
//# sourceMappingURL=authController.js.map