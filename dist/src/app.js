"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("reflect-metadata");
var restify = tslib_1.__importStar(require("restify"));
var routes_1 = require("./routes");
var Server = /** @class */ (function () {
    function Server(seeders) {
        this.seeders = seeders;
    }
    Server.prototype.start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var server;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.startSeeders())];
                    case 1:
                        _a.sent();
                        server = this.attachMiddleware(restify.createServer());
                        server.listen(8080, function () {
                            console.log('%s listening at %s', server.name, server.url);
                            routes_1.router.applyRoutes(server);
                            server.get('/', function (req, res) {
                                res.send('<p> Hello </p>');
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.startSeeders = function () {
        return this.seeders.map(function (seeder) {
            return seeder.saveSeeds();
        });
    };
    Server.prototype.attachMiddleware = function (server) {
        server.use(restify.plugins.acceptParser(server.acceptable));
        server.use(restify.plugins.queryParser());
        server.use(restify.plugins.bodyParser());
        server.pre(restify.plugins.pre.sanitizePath());
        return server;
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=app.js.map