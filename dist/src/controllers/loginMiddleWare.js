"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var entity_1 = require("../entity");
var typeorm_1 = require("typeorm");
exports.loginMiddleWare = function (req, res, next) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var userRepository, headers, accessToken, user;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userRepository = typeorm_1.getRepository(entity_1.User);
                headers = req.headers;
                if (!headers.accesstoken) {
                    res.status(401);
                    return [2 /*return*/, res.send({ message: 'Login to continue' })];
                }
                accessToken = headers.accesstoken;
                return [4 /*yield*/, userRepository.findOne({
                        accessToken: accessToken
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(401);
                    return [2 /*return*/, res.send({ message: 'Invalid Token, Login to continue' })];
                }
                req.user = user;
                next();
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=loginMiddleWare.js.map