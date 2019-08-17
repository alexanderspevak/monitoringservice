"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var entity_1 = require("../entity");
var class_validator_1 = require("class-validator");
var workers_1 = require("../workers");
var ControllerClass_1 = require("./ControllerClass");
var services_1 = require("../services");
var MonitoredEndPointController = /** @class */ (function (_super) {
    tslib_1.__extends(MonitoredEndPointController, _super);
    function MonitoredEndPointController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.workersRepository = workers_1.workers;
        _this.saveEndpoint = function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var monitoredEndpoint, errors, _a, _b, error_1;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        monitoredEndpoint = this.parseMonitoredEndpoint(req, new entity_1.MonitoredEndpoint());
                        return [4 /*yield*/, class_validator_1.validate(monitoredEndpoint)];
                    case 1:
                        errors = _c.sent();
                        if (errors.length > 0) {
                            res.status(400);
                            return [2 /*return*/, res.send(errors)];
                        }
                        _a = this.handleResponseSaveEndpoint;
                        _b = [res];
                        return [4 /*yield*/, this.service.saveMonitoredEndpoint(monitoredEndpoint)];
                    case 2:
                        _a.apply(this, _b.concat([_c.sent(), 'addEndpointCycle']));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        this.handleServerError(error_1, res);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.updateEndpoint = function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var id, userId, monitoredEndpoint, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = this.getId(req);
                        if (!id) {
                            return [2 /*return*/, this.handleResponseInvalidId(res)];
                        }
                        userId = req.user.id;
                        return [4 /*yield*/, this.findMonitoredEndpoint(id, userId)];
                    case 1:
                        monitoredEndpoint = _a.sent();
                        return [2 /*return*/, monitoredEndpoint ? this.handleUpdateEndpoint(req, res, monitoredEndpoint) : this.handleNotFoundMonitoredEndpoint(res)];
                    case 2:
                        error_2 = _a.sent();
                        this.handleServerError(error_2, res);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.deleteEndpoint = function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var userId, id, monitoredEndpoint, _a, error_3;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        userId = req.user.id;
                        id = this.getId(req);
                        if (!id) {
                            return [2 /*return*/, this.handleResponseInvalidId(res)];
                        }
                        return [4 /*yield*/, this.findMonitoredEndpoint(id, userId)];
                    case 1:
                        monitoredEndpoint = _b.sent();
                        if (!monitoredEndpoint) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.handleDeleteEndpoint(res, id, monitoredEndpoint)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = this.handleNotFoundMonitoredEndpoint(res);
                        _b.label = 4;
                    case 4: return [2 /*return*/, _a];
                    case 5:
                        error_3 = _b.sent();
                        this.handleServerError(error_3, res);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        _this.showEndpoints = function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var userId, monitoredEndpoints, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.id;
                        return [4 /*yield*/, this.service.repository.find({
                                where: {
                                    user: userId
                                }
                            })];
                    case 1:
                        monitoredEndpoints = _a.sent();
                        res.send(monitoredEndpoints);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        this.handleServerError(error_4, res);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.handleUpdateEndpoint = function (req, res, monitoredEndpoint) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var updatedMonitoredEndpoint, errors, savedMonitoredEndpoint;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedMonitoredEndpoint = this.parseMonitoredEndpoint(req, monitoredEndpoint);
                        return [4 /*yield*/, class_validator_1.validate(updatedMonitoredEndpoint)];
                    case 1:
                        errors = _a.sent();
                        if (errors.length > 0) {
                            res.status(400);
                            return [2 /*return*/, res.send(errors)];
                        }
                        return [4 /*yield*/, this.service.saveMonitoredEndpoint(updatedMonitoredEndpoint)];
                    case 2:
                        savedMonitoredEndpoint = _a.sent();
                        this.handleResponseSaveEndpoint(res, savedMonitoredEndpoint, 'updateEndpointCycle');
                        return [2 /*return*/];
                }
            });
        }); };
        _this.findMonitoredEndpoint = function (id, userId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.service.repository.findOne({
                            where: {
                                user: userId,
                                id: id
                            }
                        })];
                    case 1: return [2 /*return*/, (_a.sent()) || false];
                }
            });
        }); };
        _this.handleDeleteEndpoint = function (res, id, monitoredEndpoint) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var deleteResult;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.service.repository.delete(id)];
                    case 1:
                        deleteResult = _a.sent();
                        res.status(200);
                        res.send({ message: 'Affected Rows: ' + deleteResult.raw.affectedRows });
                        return [2 /*return*/, this.workersRepository.removeEndpointCycle(monitoredEndpoint)];
                }
            });
        }); };
        _this.handleNotFoundMonitoredEndpoint = function (res) {
            res.status(400);
            res.send('No such endpoint');
            return false;
        };
        _this.parseMonitoredEndpoint = function (req, monitoredEndpoint) {
            var _a = req.body, name = _a.name, url = _a.url, monitoredInterval = _a.monitoredInterval;
            monitoredEndpoint.name = name || monitoredEndpoint.name;
            monitoredEndpoint.url = url || monitoredEndpoint.url;
            monitoredEndpoint.monitoredInterval = monitoredInterval ? parseInt(monitoredInterval) : monitoredEndpoint.monitoredInterval;
            return monitoredEndpoint;
        };
        _this.getId = function (req) {
            var id = parseInt(req.body.id);
            return id && typeof (id) === 'number' ? id : false;
        };
        _this.handleResponseInvalidId = function (res) {
            res.status(400);
            res.send({ message: 'endpoint id needed to update' });
            return false;
        };
        return _this;
    }
    MonitoredEndPointController.prototype.handleResponseSaveEndpoint = function (res, monitoredEndpoint, updateKey) {
        if (monitoredEndpoint) {
            this.workersRepository[updateKey](monitoredEndpoint);
            res.status(200);
            return res.send(monitoredEndpoint);
        }
        res.status(500);
        return res.send({ message: 'error saving monitoredEndpoint' });
    };
    return MonitoredEndPointController;
}(ControllerClass_1.ControllerClass));
exports.MonitoredEndPointController = MonitoredEndPointController;
exports.monitoredEndpointController = new MonitoredEndPointController(services_1.monitoredEndpointService);
//# sourceMappingURL=MonitoredEndPoint.js.map