"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var entity_1 = require("../entity");
var Service_1 = require("./Service");
var MonitoredEndpointService = /** @class */ (function (_super) {
    tslib_1.__extends(MonitoredEndpointService, _super);
    function MonitoredEndpointService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MonitoredEndpointService.prototype.saveMonitoredEndpoint = function (monitoredEndpoint) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        monitoredEndpoint.dateOfLastCheck = new Date();
                        return [4 /*yield*/, this.repository.save(monitoredEndpoint)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, monitoredEndpoint];
                }
            });
        });
    };
    return MonitoredEndpointService;
}(Service_1.Service));
exports.MonitoredEndpointService = MonitoredEndpointService;
exports.monitoredEndpointService = new MonitoredEndpointService(entity_1.MonitoredEndpoint);
//# sourceMappingURL=MonitoredEndpointService.js.map