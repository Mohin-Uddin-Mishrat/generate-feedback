"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const global_error_handler_1 = __importDefault(require("./app/middlewares/global_error_handler"));
const not_found_api_1 = __importDefault(require("./app/middlewares/not_found_api"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./app/configs/swagger"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"]
}));
app.use(express_1.default.json({ limit: "100mb" }));
app.use(express_1.default.raw());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// Swagger UI
app.use("/api-docs", swagger_ui_express_1.default.serve);
app.get("/api-docs", swagger_ui_express_1.default.setup(swagger_1.default));
app.get("/api-docs-json", (req, res) => res.json(swagger_1.default));
app.use("/api", routes_1.default);
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running successful !!',
        data: null,
    });
});
app.use(global_error_handler_1.default);
app.use(not_found_api_1.default);
exports.default = app;
