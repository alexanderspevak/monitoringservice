"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("util");
var axios_1 = tslib_1.__importDefault(require("axios"));
var zlib = tslib_1.__importStar(require("zlib"));
var url = tslib_1.__importStar(require("url"));
var entity_1 = require("../entity");
var services_1 = require("../services");
var deflate = util_1.promisify(zlib.deflate);
var Workers = /** @class */ (function () {
    function Workers() {
        var _this = this;
        this.intervals = {};
        this.monitoredEndpointService = services_1.monitoredEndpointService;
        this.monitoringResultService = services_1.monitoringResultService;
        this.monitoredEndpointCallback = function (endpoint) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var endpointResponse, monitoringResult, payload, buffer, httpCode, err_1, monitoringResult;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 8]);
                        return [4 /*yield*/, axios_1.default.get(this.parseUrl(endpoint))];
                    case 1:
                        endpointResponse = _a.sent();
                        monitoringResult = new entity_1.MonitoringResult();
                        payload = endpointResponse.data || 'no data provided';
                        return [4 /*yield*/, deflate(payload)];
                    case 2:
                        buffer = _a.sent();
                        if (Buffer.isBuffer(buffer)) {
                            monitoringResult.payload = buffer.toString('base64');
                        }
                        httpCode = endpointResponse.status || 0;
                        monitoringResult.httpCode = httpCode;
                        monitoringResult.monitoredEndPoint = endpoint;
                        return [4 /*yield*/, this.saveMonitoringResult(monitoringResult)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.saveMonitoredEndpoint(endpoint)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 5:
                        err_1 = _a.sent();
                        console.log('\x1b[31m', 'No response from endpoint', err_1);
                        monitoringResult = new entity_1.MonitoringResult();
                        monitoringResult.httpCode = 500;
                        monitoringResult.payload = (Buffer.from('no response provided')).toString('base64');
                        monitoringResult.monitoredEndPoint = endpoint;
                        return [4 /*yield*/, this.saveMonitoringResult(monitoringResult)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.saveMonitoredEndpoint(endpoint)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
    }
    Workers.prototype.start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var monitoredEndpoints;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.monitoredEndpointService.repository.find()];
                    case 1:
                        monitoredEndpoints = _a.sent();
                        monitoredEndpoints.forEach(function (endpoint) { return _this.startEndpointCycle(endpoint); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Workers.prototype.startEndpointCycle = function (endpoint) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.intervals[endpoint.id] = setInterval(function () {
                    _this.monitoredEndpointCallback(endpoint);
                }, endpoint.monitoredInterval * 1000);
                return [2 /*return*/];
            });
        });
    };
    Workers.prototype.saveMonitoringResult = function (monitoringResult) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this.intervals[monitoringResult.monitoredEndPoint.id]) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.monitoringResultService.repository.save(monitoringResult)];
                    case 1:
                        _a.sent();
                        console.log("Monitoring result with endpointId: " + monitoringResult.monitoredEndPoint.id + " saved with statusCode: ", monitoringResult.httpCode);
                        return [2 /*return*/, true];
                    case 2:
                        error_1 = _a.sent();
                        console.log('\x1b[31m', 'Error saving monitoringResult:');
                        console.log('\x1b[31m', 'Error:', error_1.message);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Workers.prototype.saveMonitoredEndpoint = function (monitoredEndpoint) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        monitoredEndpoint.dateOfLastCheck = new Date();
                        return [4 /*yield*/, this.monitoredEndpointService.saveMonitoredEndpoint(monitoredEndpoint)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, monitoredEndpoint];
                    case 2:
                        error_2 = _a.sent();
                        console.log('\x1b[31m', 'Error saving :' + monitoredEndpoint);
                        console.log('\x1b[31m', 'Error:', error_2.message);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Workers.prototype.parseUrl = function (endPoint) {
        var endPointUrl = endPoint.url;
        var urlObj = new URL(endPointUrl);
        urlObj.protocol = urlObj.protocol === 'http:' ? 'http' : 'https';
        var parsedUrl = url.format(urlObj);
        return parsedUrl.replace('///', '//');
    };
    Workers.prototype.addEndpointCycle = function (endpoint) {
        this.startEndpointCycle(endpoint);
    };
    Workers.prototype.removeEndpointCycle = function (endpoint) {
        clearInterval(this.intervals[endpoint.id]);
        delete this.intervals[endpoint.id];
    };
    Workers.prototype.updateEndpointCycle = function (endpoint) {
        this.removeEndpointCycle(endpoint);
        this.addEndpointCycle(endpoint);
    };
    return Workers;
}());
exports.Workers = Workers;
exports.workers = new Workers();
//# sourceMappingURL=index.js.map