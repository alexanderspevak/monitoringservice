"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var restify_router_1 = require("restify-router");
exports.userRouter = new restify_router_1.Router();
exports.userRouter.get('/users', function (req, res) {
    res.send('hello users');
});
//# sourceMappingURL=user.js.map