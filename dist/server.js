"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const toobusy_js_1 = __importDefault(require("toobusy-js"));
const env_1 = __importDefault(require("./env"));
const versionState = [
    {
        name: "Version",
        value: process.version,
    },
    {
        name: "Root",
        value: "server.ts",
    },
    {
        name: "Port",
        value: "3005",
    },
];
const MyServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app_1.server.listen(env_1.default.PORT, () => {
            console.table(versionState);
            console.log(`Server running on http://localhost:${env_1.default.PORT} 🚀`);
        });
        process.on("SIGINT", function () {
            toobusy_js_1.default.shutdown();
            process.exit();
        });
        process.on("exit", () => toobusy_js_1.default.shutdown());
    }
    catch (error) {
        console.log(error);
        process.exit();
    }
});
MyServer();
