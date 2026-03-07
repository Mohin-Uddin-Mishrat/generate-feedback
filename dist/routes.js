"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedBack_route_1 = __importDefault(require("./app/modules/feedBack/feedBack.route"));
const appRouter = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/feedback', route: feedBack_route_1.default },
];
moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
exports.default = appRouter;
