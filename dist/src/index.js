"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var app_1 = require("./app");
var workers_1 = require("./workers");
var user_1 = require("./seeds/user");
var services_1 = require("./services");
var startApp = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var connection, server, e_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, typeorm_1.createConnection()];
            case 1:
                connection = _a.sent();
                server = new app_1.Server([new user_1.UserSeeding(connection)]);
                return [4 /*yield*/, server.start()];
            case 2:
                _a.sent();
                services_1.setRepositories();
                setTimeout(function () { return workers_1.workers.start(); }, 3000);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
startApp();
//# sourceMappingURL=index.js.map