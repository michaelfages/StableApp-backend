"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/echo", (req, res) => {
    console.log("Echo endpoint hit!", req.body);
    res.json(req.body);
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
