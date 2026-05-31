"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const routes_1 = require("./routes");
const vintage_1 = require("./routes/vintage");
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT);
mongoose_1.default.connect(process.env.MONGODB_URI);
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.BASE_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new connect_mongo_1.default({ client: mongoose_1.default.connection.getClient() })
}));
app.use(passport_1.default.session());
app.use('/', routes_1.routes);
app.use('/vintage', vintage_1.vintageRoute);
app.listen(port, '0.0.0.0', () => console.log(`Server is listening on port ${port}`));
