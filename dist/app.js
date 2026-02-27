"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const toobusy_js_1 = __importDefault(require("toobusy-js"));
const helmet_1 = __importDefault(require("helmet"));
// Set max latency on 120ms
toobusy_js_1.default.maxLag(120);
// Define app
const app = (0, express_1.default)();
exports.app = app;
// Define Server
const server = http_1.default.createServer(app);
exports.server = server;
app.use((0, helmet_1.default)());
// Cors
app.use((0, cors_1.default)({
    origin: ["http://localhost:3005", "http://localhost:3000"], // Domain that will hit this API
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Default Limit
app.use(express_1.default.json({ limit: "100kb" }));
// parse URL-encoded
app.use(express_1.default.urlencoded({ extended: false }));
// Detect overload
app.use((req, res, next) => {
    if ((0, toobusy_js_1.default)())
        return res.status(529).json({ message: "High Traffic" });
    else
        next();
});
// Cache Setup
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});
app.use("/", (req, res, next) => {
    res.send("Our Backend Running Correctly");
});
