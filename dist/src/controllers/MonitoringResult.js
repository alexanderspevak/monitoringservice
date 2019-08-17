"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util = tslib_1.__importStar(require("util"));
var zlib = tslib_1.__importStar(require("zlib"));
var config = tslib_1.__importStar(require("config"));
var ControllerClass_1 = require("./ControllerClass");
var services_1 = require("../services");
var unzip = util.promisify(zlib.unzip);
var MonitoringResultController = /** @class */ (function (_super) {
    tslib_1.__extends(MonitoringResultController, _super);
    function MonitoringResultController(service, monitoredEndpointService) {
        var _this = _super.call(this, service) || this;
        _this.getMonitoredResults = function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, userId, _c, _d, id, uncheckedLimit, endpointId, limit, monitoringResults, _e, error_1;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 5, , 6]);
                        _a = req.user, _b = (_a === void 0 ? {} : _a).id, userId = _b === void 0 ? undefined : _b, _c = req.query, _d = _c === void 0 ? {
                            id: undefined,
                            limit: undefined
                        } : _c, id = _d.id, uncheckedLimit = _d.limit;
                        endpointId = this.parseEndpointId(id);
                        limit = this.parseResponseLimit(uncheckedLimit);
                        if (!(endpointId && userId)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.checkEndpoint(userId, endpointId)];
                    case 1:
                        if (!(_f.sent())) {
                            res.status(400);
                            return [2 /*return*/, res.send("No endpoint with id: " + endpointId + " under logged in user")];
                        }
                        _e = this.parseResults;
                        return [4 /*yield*/, this.getResults(endpointId, limit)];
                    case 2: return [4 /*yield*/, _e.apply(this, [_f.sent()])];
                    case 3:
                        monitoringResults = _f.sent();
                        res.status(200);
                        return [2 /*return*/, res.send(monitoringResults)];
                    case 4:
                        res.status(400);
                        res.send({ message: 'EndPoint {id} needed in query parameter' });
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _f.sent();
                        this.handleServerError(error_1, res);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        _this.handleNotFoundEndpoint = function (res, endpointId, userId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                res.status(400);
                return [2 /*return*/, res.send({ message: "No endpoint with id: " + endpointId + " under logged in user" })];
            });
        }); };
        _this.monitoredEndpointService = monitoredEndpointService;
        return _this;
    }
    MonitoringResultController.prototype.parseEndpointId = function (endpointId) {
        if (endpointId && typeof endpointId === 'string' && typeof parseInt(endpointId) === 'number') {
            return parseInt(endpointId);
        }
        return false;
    };
    MonitoringResultController.prototype.parseResponseLimit = function (limit) {
        if (limit && typeof limit === 'string' && typeof parseInt(limit) === 'number') {
            return parseInt(limit);
        }
        return config.get('MonitoredEndpoint.responseLimit');
    };
    MonitoringResultController.prototype.checkEndpoint = function (userId, id) {
        return this.monitoredEndpointService.repository.findOne({ where: { user: userId, id: id } });
    };
    MonitoringResultController.prototype.getResults = function (monitoredEndPointId, take) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.service.repository.find({
                        take: take,
                        where: {
                            monitoredEndPoint: monitoredEndPointId
                        },
                        order: {
                            dateOfCheck: 'DESC'
                        }
                    })];
            });
        });
    };
    MonitoringResultController.prototype.parseResults = function (monitoringResults) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, Promise.all(monitoringResults.map(function (monitoringResult) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var buffer, unzipedPayload;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    buffer = Buffer.from(monitoringResult.payload, 'base64');
                                    return [4 /*yield*/, unzip(buffer)];
                                case 1:
                                    unzipedPayload = _a.sent();
                                    monitoringResult.payload = unzipedPayload.toString();
                                    return [2 /*return*/, monitoringResult];
                            }
                        });
                    }); }))];
            });
        });
    };
    return MonitoringResultController;
}(ControllerClass_1.ControllerClass));
exports.MonitoringResultController = MonitoringResultController;
exports.monitoringResultController = new MonitoringResultController(services_1.monitoringResultService, services_1.monitoredEndpointService);
//# sourceMappingURL=MonitoringResult.js.map